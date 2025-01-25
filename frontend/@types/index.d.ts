type Artist = {
  id: string;
  name: string;
  albums: Album[];
  tracks: Track[];
};

type Album = {
  id: string;
  title: string;
  year?: number;
  track_count?: number;
  cover_url?: string;
  artist_id: string;
  tracks: Track[];
  artist: Artist;
};

type Track = {
  id: string;
  title: string;
  bitrate?: number;
  album_id: string;
  artist_id: string;
  album: Album;
  artist: Artist;
};
