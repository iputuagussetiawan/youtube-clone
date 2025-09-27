import React from "react";
interface layoutProps {
    children: React.ReactNode;
}
const AuthLayout = ({ children }: layoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            {children}
        </div>
    );
};

export default AuthLayout;
