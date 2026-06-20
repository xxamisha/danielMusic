import React, { useState, useEffect } from 'react';
import Vynl from './vynl';
import Progressbar from './progressbar';
import { redirectToSpotify, exchangeToken, getToken } from '../services/auth';
import { getUserAlbums, getAlbumTracks, playTrack } from '../services/spotify';
import { initPlayer } from '../services/player';

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [albums, setAlbums] = useState<any[]>([]);
    const [currentSong, setCurrentSong] = useState<any>(null);
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [view, setView] = useState<'playlist' | 'player'>('playlist');
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [deviceId, setDeviceId] = useState<string | null>(null); // ← inside component now

    // ── Handle OAuth callback & check for existing token ──────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('code_verifier');
            exchangeToken(code).then(() => {
                window.history.replaceState({}, '', '/');
                setIsAuthenticated(true);
                setAuthLoading(false);
            }).catch(err => {
                console.error('Token exchange failed:', err);
                setAuthLoading(false);
            });
        } else if (getToken()) {
            setIsAuthenticated(true);
            setAuthLoading(false);
        } else {
            setAuthLoading(false);
        }
    }, []);

    // ── Init Spotify Web Playback SDK once authenticated ──────────────────
    useEffect(() => {
        if (!isAuthenticated) return;
        const token = getToken();
        if (!token) return;

        initPlayer(
            token,
            (id) => setDeviceId(id),
            (state) => {
                setIsPlaying(!state.paused);
                setElapsed(Math.floor(state.position / 1000));
            }
        );
    }, [isAuthenticated]);

    // ── Fetch albums once authenticated ───────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchAlbums = async () => {
            try {
                setLoading(true);
                const results = await getUserAlbums();
                const albumsWithSongs = results.map((album: any) => ({ ...album, songs: [] }));
                setAlbums(albumsWithSongs);
                if (albumsWithSongs.length > 0) setSelectedAlbumId(albumsWithSongs[0].id);
            } catch (error) {
                console.error('Failed to fetch albums:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, [isAuthenticated]);

    // ── Fetch tracks when an album is expanded ────────────────────────────
    useEffect(() => {
        const fetchTracks = async () => {
            if (!selectedAlbumId) return;
            const album = albums.find(a => a.id === selectedAlbumId);
            if (!album || album.songs.length > 0) return;

            try {
                const tracks = await getAlbumTracks(selectedAlbumId);
                setAlbums(prev => prev.map(a => a.id === selectedAlbumId ? { ...a, songs: tracks } : a));
            } catch (error) {
                console.error('Failed to fetch tracks:', error);
            }
        };
        fetchTracks();
    }, [selectedAlbumId, albums]);

    const selectedAlbum = albums.find(album => album.id === selectedAlbumId);
    const defaultCoverUrl = selectedAlbum?.coverUrl ?? '';
    const durationSec = currentSong ? parseDuration(currentSong.duration) : 0;

    // ── Playback controls ─────────────────────────────────────────────────
    const handleSongSelect = (song: any, album: any) => {
        setCurrentSong({ ...song, album });
        setElapsed(0);
        setIsPlaying(true);
        setView('player');

        if (deviceId && song.uri) {
            playTrack(deviceId, song.uri);
        }
    };

   
     const handlePlayPause = async () => {
    const token = getToken();
    if (!token || !deviceId) {
        console.log('No token or device ID yet:', { token, deviceId });
        return;
    }

    if (isPlaying) {
        await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
    } else {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
    }
    setIsPlaying(p => !p);
};
    

    const handleForward = () => {
        if (!currentSong || !selectedAlbum) return;
        const idx = selectedAlbum.songs.findIndex((s: any) => s.title === currentSong.title);
        if (idx < selectedAlbum.songs.length - 1) {
            const next = selectedAlbum.songs[idx + 1];
            handleSongSelect(next, selectedAlbum);
        }
    };

    const handleBackward = () => {
        if (!currentSong || !selectedAlbum) return;
        const idx = selectedAlbum.songs.findIndex((s: any) => s.title === currentSong.title);
        if (idx > 0) {
            const prev = selectedAlbum.songs[idx - 1];
            handleSongSelect(prev, selectedAlbum);
        }
    };

    const toggleAlbumExpanded = (albumId: string) => {
        setSelectedAlbumId(albumId);
        setExpandedAlbums(prev => {
            const next = new Set(prev);
            next.has(albumId) ? next.delete(albumId) : next.add(albumId);
            return next;
        });
    };

    // ── Progress timer (fallback sync) ────────────────────────────────────
    useEffect(() => {
        if (!currentSong || !isPlaying) return;
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

    // ── Loading ───────────────────────────────────────────────────────────
    if (authLoading) {
        return (
            <div style={styles.centered}>
                <div style={{ color: '#555', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>Loading...</div>
            </div>
        );
    }

    // ── Login screen ──────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div style={styles.centered}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 24 }}>🎵</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#555', marginBottom: 32, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Connect your Spotify to get started
                    </div>
                    <button onClick={redirectToSpotify} style={styles.spotifyBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Connect Spotify
                    </button>
                </div>
            </div>
        );
    }

    // ── Playlist view ─────────────────────────────────────────────────────
    if (view === 'playlist') {
        return (
            <div style={{ backgroundColor: '#000000', fontFamily: 'sans-serif', color: '#dadadacc', padding: 40, minHeight: '100vh', overflowY:'auto' }}>
                <div style={{ marginBottom: 20, fontFamily: 'DM Mono, monospace', color: "#878686cc" }}>
                    Your Albums
                </div>
                <button 
    onClick={() => currentSong && setView('player')} 
    style={{ ...styles.navBtn, opacity: currentSong ? 1 : 0.3, cursor: currentSong ? 'pointer' : 'default', flexDirection:"row"  }}
>
    Back
</button>
                {loading ? (
                    <div style={{ color: '#555', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>Fetching your albums...</div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {albums.map(album => (
                            <li key={album.id} style={{ marginBottom: 16, borderBottom: '1px solid #333' }}>
                                <button
                                    onClick={() => toggleAlbumExpanded(album.id)}
                                    style={{
                                        padding: '12px 0', width: '100%', textAlign: 'left',
                                        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                        fontSize: 16, fontWeight: 500, display: 'flex',
                                        justifyContent: 'space-between', alignItems: 'center',
                                        fontFamily: 'DM Mono, monospace', color: "#dadadacc",
                                    }}
                                >
                                    <span>{album.name}</span>
                                    <span style={{ fontSize: 12, opacity: 0.7 }}>
                                        {expandedAlbums.has(album.id) ? '▼' : '▶'}
                                    </span>
                                </button>

                                {expandedAlbums.has(album.id) && (
                                    <ul style={{ listStyle: 'none', padding: '0 0 0 16px', marginTop: 8 }}>
                                        {album.songs.length === 0 ? (
                                            <li style={{ color: '#555', fontSize: 12, fontFamily: 'DM Mono, monospace', padding: '6px 0' }}>
                                                Loading tracks...
                                            </li>
                                        ) : album.songs.map((song: any) => (
                                            <li key={song.title} style={{ margin: '6px 0' }}>
                                                <button
                                                    onClick={() => handleSongSelect(song, album)}
                                                    style={{
                                                        padding: '6px 8px', backgroundColor: 'transparent',
                                                        border: 'none', borderRadius: 4, cursor: 'pointer',
                                                        fontSize: 14, fontFamily: 'DM Mono, monospace', color: "#c0bebecc",
                                                    }}
                                                >
                                                    {song.title} ({song.duration})
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    // ── Player view ───────────────────────────────────────────────────────
    return (
        <div style={{ backgroundColor: '#000000', fontFamily: 'sans-serif', color: '#dadadacc' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100vh' }}>
                <div style={{ position: 'absolute', top: 40, right: 150 }}>
                    <button onClick={() => setView('playlist')} style={styles.navBtn}>
                        Change playlist
                    </button>
                </div>

                <Vynl albumCoverURL={currentSong?.album.coverUrl ?? defaultCoverUrl} isPlaying={isPlaying} />

                <div style={{ textAlign: 'center' }}>
                    <div style={{ padding: 6, fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSong?.title}
                    </div>
                    <div style={{ padding: 4, color: '#888' }}>{currentSong?.album?.artists}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <button onClick={handleBackward} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                            </svg>
                        </button>

                        {/* ← now calls handlePlayPause, not just setIsPlaying */}
                        <button onClick={handlePlayPause} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            {isPlaying ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }}>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        <button onClick={handleForward} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                                <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
                            </svg>
                        </button>
                    </div>

                    <Progressbar elapsed={elapsed} duration={durationSec} isPlaying={isPlaying} onSeek={(newElapsed) => setElapsed(newElapsed)} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    centered: {
        backgroundColor: '#000',
        minHeight: '100vh',
        overFlowY:'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    } as React.CSSProperties,
    navBtn: {
        background: 'none',
        border: '1px solid #2a2a2a',
        color: '#888',
        fontFamily: 'DM Mono, monospace',
        fontSize: '11px',
        letterSpacing: '0.1em',
        padding: '6px 14px',
        borderRadius: '20px',
        cursor: 'pointer',
    } as React.CSSProperties,
    spotifyBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 28px',
        borderRadius: 40,
        border: '1px solid #1DB954',
        background: 'transparent',
        color: '#1DB954',
        fontFamily: 'DM Mono, monospace',
        fontSize: 13,
        letterSpacing: '0.08em',
        cursor: 'pointer',
        margin: '0 auto',
    } as React.CSSProperties,
};

export default Player;