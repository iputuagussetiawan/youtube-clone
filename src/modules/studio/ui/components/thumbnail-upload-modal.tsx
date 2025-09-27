import ResponsiveModal from "@/components/responsive-modal";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ThumbnailUploadModal({
    videoId,
    open,
    onOpenChange,
}: ThumbnailUploadModalProps) {
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        onOpenChange(false);
        utils.studio.getMany.invalidate();
        utils.studio.getOne.invalidate({ id: videoId });
    };
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Upload a Thumbnail"
        >
            <UploadDropzone
                endpoint="thumbnailUploader"
                input={{ videoId }}
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveModal>
    );
}
