"use client"
import { Button } from "@/components/ui/button"
import { UserCircleIcon } from "lucide-react"
import { UserButton, SignInButton, SignedIn, SignedOut} from "@clerk/nextjs"

export const AuthButton=()=>{
  
    return(
        <>
            <SignedIn>
                <UserButton>
                    <UserButton.MenuItems>
                        {/* TODO - add user profile */}
                        <UserButton.Link
                            label="Studio"
                            href="/studio"
                            labelIcon={<UserCircleIcon className="mr-1 size-4" />}
                        >

                        </UserButton.Link>
                        <UserButton.Action label="manageAccount"/>
                    </UserButton.MenuItems>
                </UserButton>
                {/* TODO
                .3+ - add menu items for studio */}
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                        variant={"outline"}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
                    >
                        <UserCircleIcon className="mr-1 size-5" />
                        <span>Sign In</span>
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    )

}