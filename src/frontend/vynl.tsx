import React, { useState } from 'react';

export default function Vynl({ albumCoverURL }: { albumCoverURL: string }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black relative flex items-center justify-center">
            {albumCoverURL ? (
                <img src={albumCoverURL} alt="Album Cover" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-indigo-600" />
            )}

            <div className="absolute w-3 h-3 bg-neutral-900 rounded-full border border-neutral-400" />
        </div>
    );
}