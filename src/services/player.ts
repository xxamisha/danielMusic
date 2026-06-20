/// <reference types="vite/client" />

declare global {
    interface Window {
        Spotify: any;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

export function initPlayer(token: string, onReady: (deviceId: string) => void, onStateChange: (state: any) => void) {
    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
            name: 'My Vinyl Player',
            getOAuthToken: (cb: (token: string) => void) => cb(token),
            volume: 0.5,
        });

        player.addListener('ready', ({ device_id }: { device_id: string }) => {
            console.log('Ready with device ID', device_id);
            onReady(device_id);
        });

        player.addListener('player_state_changed', (state: any) => {
            if (state) onStateChange(state);
        });

        player.connect();
    };
}