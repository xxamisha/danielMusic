//this has components that will have the play/pause features and progress bar

import React, { useState } from 'react';
import Vynl from './vynl';

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

    return (
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100vh' }}>
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
        </div>
    );
}; export default Player; 