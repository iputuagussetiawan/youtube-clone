"use client";
import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import { on } from "events";
import { THUMBNAIL_FALLBACK } from "../../constants";

interface VideoPlayerProps {
    playbackId?: string | null | undefined;
    thumbnailUrl?: string | null | undefined;
    autoPlay?: boolean;
    onPlay?: () => void;
}
const VideoPlayer = ({
    playbackId,
    thumbnailUrl,
    autoPlay,
    onPlay,
}: VideoPlayerProps) => {
    // if(!playbackId) return null
    return (
        <MuxPlayer
            playbackId={playbackId || ""}
            onPlay={onPlay}
            poster={thumbnailUrl || THUMBNAIL_FALLBACK}
            playerInitTime={0}
            autoPlay={autoPlay}
            thumbnailTime={0}
            className="w-full h-full object-contain"
            accentColor="#ff2056"
        />
    );
};

export default VideoPlayer;
