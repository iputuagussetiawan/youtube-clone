import React from 'react'
import { cn } from '@/lib/utils'
import {Button } from '@/components/ui/button'

interface SubscriptionButtonProps{
    onClick?: () => void;
    disabled?: boolean;
    isSubscribed?: boolean;
    className?: string
    size?:"default" | "sm" | "lg" | "icon" | null | undefined
}

const SubscriptionButton = ({ onClick, disabled, isSubscribed, className, size}:SubscriptionButtonProps) => {
    return (
        <Button 
            size={size} 
            disabled={disabled} 
            onClick={onClick} 
            className={cn("rounded-full", className)}
            variant={isSubscribed ? "secondary" : "default"}
        >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
    )
}

export default SubscriptionButton