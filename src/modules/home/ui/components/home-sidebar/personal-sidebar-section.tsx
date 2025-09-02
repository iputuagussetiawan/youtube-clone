"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon, ListVideoIcon, PlaySquareIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";


const items=[
    {
        title:"History",
        url:"/playlists/history",
        icon:HistoryIcon,
        auth:true
    },
    {
        title:"Liked Videos",
        url:"/playlists/liked",
        icon:ThumbsUpIcon,
        auth:true
    },
    {
        title:"All Playlists",
        url:"/playlists",
        icon:ListVideoIcon
    },
];
const PersonalSidebarSection = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Personal</SidebarGroupLabel>
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

export default PersonalSidebarSection





