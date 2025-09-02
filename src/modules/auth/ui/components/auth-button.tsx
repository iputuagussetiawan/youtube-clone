import { Button } from "@/components/ui/button"
import { UserCircle, UserCircleIcon } from "lucide-react"

export const AuthButton=()=>{
    //TODO - add auth functionality
    return(
        <>
            <Button
                variant={"outline"}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
            >
                <UserCircleIcon className="mr-1 size-5" />
                <span>Sign In</span>
            </Button>
        </>
    )

}