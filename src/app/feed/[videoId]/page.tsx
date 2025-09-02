import React from 'react'


interface PageProps {
    params: Promise<{videoId:string}>;
}
const page =async ({params}: PageProps) => {
    console.log("server component")
    const {videoId}=await params
    return (
        <div>video id page : {videoId} </div>
    )
}

export default page