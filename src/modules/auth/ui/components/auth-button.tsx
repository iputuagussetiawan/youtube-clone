import { Button } from "@/components/ui/button"
import { UserCircle, UserCircleIcon } from "lucide-react"

export const AuthButton=()=>{
    return(
        <>
            <Button>
                <UserCircleIcon className="mr-1 size-4" />
                <span>Sign In</span>
            </Button>
        </>
    )

}