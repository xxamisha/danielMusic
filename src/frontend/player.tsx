//this has compontents that will have the play paudse features adn progress bar

//mock data
const fakeAlbums = {

    id:"1", 
    name: "definitely maybe",
    artists: "oasis",
    songs: [  { title: "champagne supernova", duration: "4:20" }, { title: "live forever", duration: "4:10" } ],

    id:"2",
    name: "the dark side of the moon",
    artists: "pink floyd",
    songs: [  { title: "money", duration: "6:30" }, { title: "time", duration: "7:00" } ],
}

//call the spotify api to get the current playing song and display it in the player component
import {pause} from './pause.tsx';
import {play} from './play';
import {progressBar} from './progressBar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Vynl from './vynl';
export const Player = () => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isplaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchCurrentSong = async () => {
            try {
                const response = await axios.get('/api/current-song');
                setCurrentSong(response.data);
                setIsPlaying(response.data.is_playing);
                setProgress(response.data.progress_ms);
            } catch (error) {
                console.error('Error fetching current song:', error);
            }

        };
        fetchCurrentSong();
    }, []);

    const handlePlayPause = async () => {
        try {
            if (isplaying) {
                await pause();
            } else {
                await play();
            }
            setIsPlaying(!isplaying);
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };
    
    return ( 
        <Vynl albumCoverURL={currentSong?.album?.images[0]?.url || ''} />
    );
}