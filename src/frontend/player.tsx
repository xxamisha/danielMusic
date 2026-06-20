//this has components that will have the play/pause features and progress bar

import React, { useState,useEffect } from 'react';
import Vynl from './vynl';
import Progressbar from './progressbar';
const fakeAlbums = [
    {
        id: '1',
        name: 'Definitely Maybe',
        artists: 'Oasis',
        coverUrl: 'https://via.placeholder.com/300?text=Definitely+Maybe',
        songs: [
            { title: 'Champagne Supernova', duration: '4:20' },
            { title: 'Live Forever', duration: '4:10' }
        ]
    },
    {
        id: '2',
        name: 'The Dark Side of the Moon',
        artists: 'Pink Floyd',
        coverUrl: 'https://via.placeholder.com/300?text=Dark+Side+of+the+Moon',
        songs: [
            { title: 'Money', duration: '6:30' },
            { title: 'Time', duration: '7:00' }
        ]
    }
];

function parseDuration(d: string | number | undefined) {
    if (!d && d !== 0) return 0;
    const s = String(d);
    if (s.includes(':')) {
        const parts = s.split(':').map(p => parseInt(p, 10) || 0);
        return parts.length === 2 ? parts[0] * 60 + parts[1] : parts.reduce((acc, n) => acc * 60 + n, 0);
    }
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? 0 : n;
}

export const Player = () => {
    const [currentSong, setCurrentSong] = useState<any>(null);
    const [selectedAlbumId, setSelectedAlbumId] = useState(fakeAlbums[0]?.id);
    const [view, setView] = useState<'playlist' | 'library' | 'player'>('playlist');
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    const selectedAlbum = fakeAlbums.find(album => album.id === selectedAlbumId);
    const defaultCoverUrl = selectedAlbum?.coverUrl ?? '';

    const handlePlaylistBack = () => {
        if (currentSong) {
            setView('player');
        } else if (selectedAlbumId) {
            setView('library');
        }
    };

    const handleSongSelect = (song: { title: string; duration: string }) => {
        setCurrentSong({ ...song, album: selectedAlbum });
        setElapsed(0);
        setIsPlaying(false);
        setView('player');
    };

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };
    const handleForward = () => {
        if (!currentSong || !selectedAlbum) return;
        const currindex = selectedAlbum.songs.findIndex((s: { title: string; duration: string }) => s.title === currentSong.title);
        if (currindex < selectedAlbum.songs.length - 1) {
            setCurrentSong({ ...selectedAlbum.songs[currindex + 1], album: selectedAlbum });
            setElapsed(0);
            setIsPlaying(true);
        }
        
    };
    const handleBackward = () => {
        if (!currentSong || !selectedAlbum) return;
        const currindex = selectedAlbum.songs.findIndex((s: { title: string; duration: string }) => s.title === currentSong.title);
        if (currindex > 0) {
            setCurrentSong({ ...selectedAlbum.songs[currindex - 1], album: selectedAlbum });
            setElapsed(0);
            setIsPlaying(true);
        }
    };
    const handleTitle =() => {
        if(currentSong){
            return `${currentSong.title}`; 

        };
        
        };
    const handleArtist =() => {
        if(currentSong){
            return `${currentSong.album.artists}`;
        };
    };
   

        const durationSec = currentSong ? parseDuration(currentSong.duration) : 0;

        useEffect(() => {
                if (!currentSong) { setElapsed(0); return; }
                if (!isPlaying) return;
                const id = window.setInterval(() => {
                        setElapsed(e => {
                                if (durationSec && e + 1 >= durationSec) {
                                        handleForward();
                                        return 0;
                                }
                                return e + 1;
                        });
                }, 1000);
                return () => clearInterval(id);
        }, [isPlaying, currentSong, durationSec]);
    
    // Playlist view - select album
    if (view === 'playlist') {
        return (
            <div style={{ backgroundColor: '#000000', fontFamily: 'sans-serif', color: '#dadadacc', minHeight: '100vh', padding: 40 }}>
                <button onClick={handlePlaylistBack} style={{ marginBottom: 20, padding: '4px 8px', backgroundColor: '#504e4eaa', color: '#ccc', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Back
                </button>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {fakeAlbums.map(album => (
                        <li key={album.id} style={{ margin: '16px 0' }}>
                            <button onClick={() => { setSelectedAlbumId(album.id); setView('library'); }} style={{ padding: '8px 16px', backgroundColor: '#504e4eaa', color: '#ccc', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>
                                {album.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Library view - select song from album
    if (view === 'library') {
        return (
            <div style={{ backgroundColor: '#000000', fontFamily: 'sans-serif', color: '#dadadacc', padding: 40, minHeight: '100vh' }}>
                <button onClick={() => setView('playlist')} style={{ marginBottom: 20, padding: '4px 8px', backgroundColor: '#504e4eaa', color: '#ccc', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Back
                </button>
                <h2>{selectedAlbum?.name}</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedAlbum?.songs.map(song => (
                        <li key={song.title} style={{ margin: '8px 0' }}>
                            <button onClick={() => handleSongSelect(song)} style={{ padding: '8px 12px', backgroundColor: '#333333aa', color: '#ccc', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                                {song.title} ({song.duration})
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Player view - playing song
    return (
        <div style={{ backgroundColor: '#000000', fontFamily: 'sans-serif', color: '#dadadacc' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100vh' }}>
           <div style={{ position: 'absolute', top: 40, right: 150 }}>
            <button onClick={() => setView('playlist')} style={{ padding: '4px 8px', backgroundColor: '#504e4eaa', fontFamily: 'sans-serif',color:'#ccc', borderRadius: 4, border: 'none', cursor: 'pointer' }}>
                Change playlist
            </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <div>
                    <Vynl albumCoverURL={currentSong?.album.coverUrl ?? defaultCoverUrl} isPlaying={isPlaying} />
                </div>
                
            </div>
            <div>
            <div style={{padding: 4}}> {handleTitle()} </div>
            <div style={{padding: 0}}> {handleArtist()} </div>
            </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
                        <button onClick={handleBackward} style ={{background:'transparent', border:'none'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
                  </svg></button>
                        <button className="play-btn" onClick={handlePlayPause} style={{ background: 'transparent', border:'none' }}>
                            {isPlaying ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }}>
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                        </button>
                        <button onClick={handleForward} style ={{background:'transparent', border:'none'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                    <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
                  </svg></button>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'row',alignItems: 'flex-end',gap: 20}}> 
                        <Progressbar elapsed={elapsed} duration={durationSec} isPlaying={isPlaying} />
                    </div>
                </div>
            </div>
        </div>
        
    );
}; export default Player; 