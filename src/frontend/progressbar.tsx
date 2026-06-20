import React from 'react';

export default function Progressbar({ elapsed, duration, isPlaying, onSeek} : { elapsed: number, duration: number, isPlaying: boolean, onSeek: (elapsed: number) => void }) {
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const pct = duration ? clamp(elapsed / duration) : 0;

    const formatTime = (s: number) => {
        const sec = Math.max(0, Math.floor(s));
        const m = Math.floor(sec / 60);
        const ss = String(sec % 60).padStart(2, '0');
        return `${m}:${ss}`;
    };
const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!onSeek || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPct = clickX / rect.width;
        const newElapsed = clickPct * duration;
        onSeek(newElapsed);
    };
    return (
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <div 
            onClick={handleBarClick}
            style={{ width: '100%', height: 8, backgroundColor: 'lightgray', borderRadius: 4 }}>
                <div style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: '#000000cc', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.9 }}>
                {formatTime(elapsed)} / {formatTime(duration)}
            </div>
        </div>
    );
}