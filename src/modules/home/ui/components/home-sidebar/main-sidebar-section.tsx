"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";


const items=[
    {
        title:"Home",
        url:"/",
        icon:HomeIcon
    },
    {
        title:"Subscriptions",
        url:"/feed/subscriptions",
        icon:PlaySquareIcon,
        auth:true
    },
    {
        title:"Trending",
        url:"/feed/trending",
        icon:PlaySquareIcon
    },
];
const MainSidebarSection = () => {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item,index)=>(
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={false}
                                onClick={() => {}}
                            >
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon/>
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export default MainSidebarSection





