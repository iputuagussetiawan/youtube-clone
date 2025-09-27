import { HomeLayout } from "@/modules/studio/ui/layouts/studio-layout";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}
const layout = ({ children }: LayoutProps) => {
    return <HomeLayout>{children}</HomeLayout>;
};

export default layout;
