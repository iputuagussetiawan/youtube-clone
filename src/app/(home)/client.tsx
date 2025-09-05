"use client"

import { trpc } from "@/trpc/client"

export const PageHomeClient = () => {
    const [data]=trpc.hello.useSuspenseQuery({
        text:"Hello AG"
    })
    return (
        <div>
            <h1>TRPC Say : {data?.greeting}</h1>
        </div>
    )
}