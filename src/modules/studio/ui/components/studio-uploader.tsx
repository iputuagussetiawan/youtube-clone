import MuxUploader,{
    MuxUploaderDrop,
    MuxUploaderFileSelect,
    MuxUploaderProgress,
    MuxUploaderStatus,
} from '@mux/mux-uploader-react'
interface StudioUploaderProps {
    endpoint?: string | null
    onSuccess: () => void
}

import React from 'react'

const StudioUploader = ({
    endpoint,
    onSuccess
}: StudioUploaderProps) => {
    return (
        <div>
            <MuxUploader endpoint={endpoint}/>
        </div>
    )
}

export default StudioUploader