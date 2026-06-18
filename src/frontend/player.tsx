//this has components that will have the play/pause features and progress bar

import React, { useState } from 'react';
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

export const Player = () => {
    const [currentSong, setCurrentSong] = useState<any>(null);
    const [selectedAlbumId, setSelectedAlbumId] = useState(fakeAlbums[0]?.id);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const selectedAlbum = fakeAlbums.find(album => album.id === selectedAlbumId);
    const defaultCoverUrl = selectedAlbum?.coverUrl ?? '';

    const handleSongSelect = (song: { title: string; duration: string }) => {
        setCurrentSong({ ...song, album: selectedAlbum });
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    if (showPlaylist) {
        return (
            <div style={{ padding: 20 }}>
                <button onClick={() => setShowPlaylist(false)}>Back</button>
                <h2>{selectedAlbum?.name ?? 'Albums'}</h2>
                <ul>
                    {selectedAlbum?.songs ? (
                        selectedAlbum.songs.map(s => (
                            <li key={s.title} style={{ margin: '8px 0' }}>
                                <button onClick={() => { handleSongSelect(s); setShowPlaylist(false); }}>
                                    {s.title} ({s.duration})
                                </button>
                            </li>
                        ))
                    ) : (
                        fakeAlbums.map(album => (
                            <li key={album.id} style={{ margin: '8px 0' }}>
                                <button onClick={() => { setSelectedAlbumId(album.id); }}>{album.name}</button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        );
    }
    return (
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100vh' }}>
            <button onClick={() => { setSelectedAlbumId(fakeAlbums[0]?.id); setShowPlaylist(true); }}>Change playlist</button>
            
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <div>
                    <Vynl albumCoverURL={currentSong?.album.coverUrl ?? defaultCoverUrl} isPlaying={isPlaying} />
                </div>
            </div>
            <div> 
            
                <button onClick={handlePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
            <div style={{ display:'flex', flexDirection: 'row',alignItems: 'flex-end',gap: 20}}> 
                <Progressbar progress={currentSong ? 0.5 : 0} isPlaying={isPlaying} />

            </div>
        </div>
    );
}; export default Player; 