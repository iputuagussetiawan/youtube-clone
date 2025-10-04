import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Value } from "@radix-ui/react-select";
import { Loader, Loader2 } from "lucide-react";


interface CommentFormProps {
    videoId: string;
    onSuccess?: () => void
}

const formSchema = z.object({
    videoId: z.string(),
    value: z.string().min(2, {
        message: "message must be at least 2 characters.",
    }),
})


const CommentForm = ({ videoId, onSuccess}: CommentFormProps) => {
    const clerk=useClerk();
    const utils=trpc.useUtils();
    const create=trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({videoId});
            form.reset();
            toast.success("Comment created");
            onSuccess?.();
        },

        onError: (error) => {
            toast.error("Something went wrong");
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });
    const {user}=useUser(); 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoId,
            value:""
        }
    })

    const handleSubmit=async(data:z.infer<typeof formSchema>) => {
        console.log(data)
        create.mutate(data);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-4 group">
                <UserAvatar 
                    size={"lg"} 
                    imageUrl={user?.imageUrl || "/images/user-placeholder.svg"}
                    name={user?.username || ""}
                />
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea {...field} className="resize-none bg-transparent overflow-hidden min-h-0" placeholder="Add a comment..." />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-end gap-2 mt-2 flex">
                        <Button disabled={create.isPending} type="submit" size={"sm"}>
                            {create.isPending ?(<Loader2 className="animate-spin" />):(""
                            ) }
                            
                            <span>Comment</span>
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default CommentForm