import { formatDuration } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'
import { THUMBNAIL_FALLBACK } from '../../constants';

interface VideoThumbnailProps {
    imageUrl?: string | null;
    title: string;
    previewUrl?: string | null;
    duration: number
}

const VideoThumbnail = ({
    imageUrl,
    title,
    previewUrl,
    duration
}: VideoThumbnailProps) => {
    return (
        <div className='relative group'>
            <div className='relative w-full overflow-hidden transition-all rounded-xl aspect-video'>
                <Image 
                    src={imageUrl || THUMBNAIL_FALLBACK}
                    alt={title}
                    fill
                    className='hight-full w-full object-cover group-hover:opacity-0'
                />
                <Image 
                    src={previewUrl || THUMBNAIL_FALLBACK}
                    alt={title}
                    fill
                    className='hight-full w-full object-cover opacity-0 group-hover:opacity-100'
                />
            </div>
            <div className='absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium'>
                {formatDuration(duration)}
            </div>
        </div>
    )
}

export default VideoThumbnail
