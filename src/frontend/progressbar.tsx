import React from 'react';

export default function Progressbar({ elapsed, duration, isPlaying } : { elapsed: number, duration: number, isPlaying: boolean }) {
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const pct = duration ? clamp(elapsed / duration) : 0;

    const formatTime = (s: number) => {
        const sec = Math.max(0, Math.floor(s));
        const m = Math.floor(sec / 60);
        const ss = String(sec % 60).padStart(2, '0');
        return `${m}:${ss}`;
    };

    return (
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <div style={{ width: '100%', height: 8, backgroundColor: 'lightgray', borderRadius: 4 }}>
                <div style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: '#000000cc', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.9 }}>
                {formatTime(elapsed)} / {formatTime(duration)}
            </div>
        </div>
    );
}