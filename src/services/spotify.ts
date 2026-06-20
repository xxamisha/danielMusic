/// <reference types="vite/client" />

import { getToken } from './auth.ts';

async function fetchWebApi(endpoint: string, method: string = 'GET', body?: any) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated. Please log in with Spotify.');

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
  return await res.json();
}

export async function searchAlbums(query: string, limit: number = 20) {
  const data = await fetchWebApi(`v1/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`);
  return data.albums.items.map((album: any) => ({
    id: album.id,
    name: album.name,
    artists: album.artists.map((a: any) => a.name).join(', '),
    coverUrl: album.images[0]?.url || '',
    releaseDate: album.release_date,
  }));
}

export async function getAlbumTracks(albumId: string) {
  const data = await fetchWebApi(`v1/albums/${albumId}/tracks?limit=50`);
  return data.items.map((track: any) => ({
    title: track.name,
    duration: formatDuration(track.duration_ms),
    durationMs: track.duration_ms,
    artist: track.artists.map((a: any) => a.name).join(', '),
    previewUrl: track.preview_url,
  }));
}

export async function getTopTracks(limit: number = 20) {
  const data = await fetchWebApi(`v1/me/top/tracks?limit=${limit}`);
  return data.items.map((track: any) => ({
    id: track.id,
    title: track.name,
    artists: track.artists.map((a: any) => a.name).join(', '),
    albumName: track.album.name,
    duration: formatDuration(track.duration_ms),
    durationMs: track.duration_ms,
    coverUrl: track.album.images[0]?.url || '',
    previewUrl: track.preview_url,
  }));
}

export async function getPlaylistTracks(playlistId: string) {
  const data = await fetchWebApi(`v1/playlists/${playlistId}/tracks?limit=50`);
  return data.items.map((item: any) => {
    const track = item.track;
    return {
      title: track.name,
      artists: track.artists.map((a: any) => a.name).join(', '),
      albumName: track.album.name,
      duration: formatDuration(track.duration_ms),
      durationMs: track.duration_ms,
      coverUrl: track.album.images[0]?.url || '',
      previewUrl: track.preview_url,
    };
  });
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}