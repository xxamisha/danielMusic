/// <reference types="vite/client" />

declare global {
    interface Window {
        Spotify: any;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

function createPlayer(token: string, onReady: (deviceId: string) => void, onStateChange: (state: any) => void) {
    const player = new window.Spotify.Player({
        name: 'My Vinyl Player',
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.5,
    });

    player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('✅ Spotify player ready, device ID:', device_id);
        onReady(device_id);
    });

    player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('❌ Device gone offline:', device_id);
    });

    player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Init error:', message);
    });

    player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Auth error:', message);
    });

    player.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Account error (need Premium?):', message);
    });

    player.addListener('player_state_changed', (state: any) => {
        if (state) onStateChange(state);
    });

    player.connect().then((success: boolean) => {
        console.log(success ? '✅ Player connected' : '❌ Player failed to connect');
    });
}

export function initPlayer(
    token: string,
    onReady: (deviceId: string) => void,
    onStateChange: (state: any) => void
) {
    if (window.Spotify) {
        // SDK already loaded, create player immediately
        createPlayer(token, onReady, onStateChange);
    } else {
        // SDK not loaded yet, wait for it
        window.onSpotifyWebPlaybackSDKReady = () => {
            createPlayer(token, onReady, onStateChange);
        };
    }
}