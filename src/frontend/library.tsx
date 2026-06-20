export function songselection(selectedAlbum ) => {

}return(


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
);