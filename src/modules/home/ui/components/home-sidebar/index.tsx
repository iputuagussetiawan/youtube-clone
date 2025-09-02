import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import MainSidebarSection from "./main-sidebar-section"
import { Separator } from "@/components/ui/separator"
import PersonalSidebarSection from "./personal-sidebar-section"

export const HomeSidebar=()=>{
    return(
        <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
            <SidebarContent className="bg-background">
                <MainSidebarSection />
                <Separator className="my-2" />
                <PersonalSidebarSection />
            </SidebarContent>
        </Sidebar>
    )
}