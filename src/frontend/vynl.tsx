import React, { useState } from 'react';

export default function Vynl({ albumCoverURL, isPlaying }: { albumCoverURL: string; isPlaying: boolean }) {
    return (
        <div style={{ animation: isPlaying? "spin 2.4s linear infinite": "none"}}>
        <div
            style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid black',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {albumCoverURL ? (
                <img
                    src={albumCoverURL}
                    alt="Album Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#4f46e5' }} />
            )}

            <div
                style={{
                    position: 'absolute',
                    width: 12,
                    height: 12,
                    backgroundColor: '#111827',
                    borderRadius: '50%',
                    border: '1px solid #d1d5db'
                }}
            />
        </div>
        </div>
    );
}