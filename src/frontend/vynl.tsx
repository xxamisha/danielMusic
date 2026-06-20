import React from 'react';

const accentColor = '#8b5cf6';

export default function Vynl({ albumCoverURL, isPlaying }: { albumCoverURL: string; isPlaying: boolean }) {
    return (
         <div style={{ position: "relative", width: 260, height: 260 }}>
      {/* Spinning disc */}
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `
            radial-gradient(circle at 50% 50%,
              #1a1a1a 0%,
              #1a1a1a 17%,
              #111 19%,
              #222 22%,
              #111 24%,
              #1c1c1c 30%,
              #111 34%,
              #1e1e1e 40%,
              #111 44%,
              #1c1c1c 50%
            )
          `,
          boxShadow: `0 0 0 1px #333, 0 8px 40px rgba(0,0,0,0.7), 0 0 60px ${accentColor}18`,
          animation: isPlaying ? "spin 2.4s linear infinite" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Album art centre label */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #111",
            boxShadow: "0 0 0 2px #2a2a2a",
            flexShrink: 0,
          }}
        >
          <img
            src={albumCoverURL}
            alt="album art"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
 
        {/* Centre spindle dot */}
        <div
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#555",
            border: "1px solid #777",
          }}
        />
      </div>
    </div>
  );
}