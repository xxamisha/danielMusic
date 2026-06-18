import React, { useState } from 'react';

export default function Vynl({ albumCoverURL, isPlaying }: { albumCoverURL: string; isPlaying: boolean }) {
    return (
        <div style={{ animation: isPlaying? "spin 2.4s linear infinite": "none", transformOrigin: 'center' }}>
        <div
            style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid white',
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
                <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }} />
            )}

            <div
                style={{
                    position: 'absolute',
                    width: 12,
                    height: 12,
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    border: '1px solid #ffffff'
                }}
            />
        </div>
        </div>
    );
}