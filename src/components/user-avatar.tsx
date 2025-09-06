import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {cva, type VariantProps} from 'class-variance-authority'
import { cn } from '@/lib/utils';

const avatarVariants = cva("",{
    variants:{
        size:{
            default:"w-9 h-9",
            xs:"w-4 h-4",
            sm:"w-6 h-6",
            lg:"w-10 h-10",
            xl:"w-[160px] h-[160px]"
        }
    },
    defaultVariants:{
        size:"default"
    }
})

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
    imageUrl:string;
    name:string;
    className?:string;
    onClick?:() => void
}

const UserAvatar = ({
    imageUrl,
    name,
    className,
    size,   
    onClick
}:UserAvatarProps) => {
    return (
        <div>
            <Avatar className={cn(avatarVariants({size, className}))} onClick={onClick}>
                <AvatarImage src={imageUrl} alt={name} />
            </Avatar>
        </div>
    )
}

export default UserAvatar