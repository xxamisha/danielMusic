

const Playlist = ({ albums, onSongSelect }: { albums: any[]; onSongSelect: (song: any) => void }) => {
    return (
        <div>
            {albums.map(album => (
                <div key={album.id}>
                    <div>{album.name}</div>
                    <div>{album.artists}</div>
                    <img src={album.coverUrl} alt={album.name} />
                    <ul>
                        {album.songs.map((song: any, index: number) => (
                            <li key={index} onClick={() => onSongSelect(song)}>
                                {song.title} - {song.duration}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Playlist;