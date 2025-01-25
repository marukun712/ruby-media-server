type Artist = {
  id: string;
  name: string;
};

type Album = {
  id: string;
  title: string;
  year?: number;
  track_count?: number;
  cover_url?: string;
  artist_id: string;
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
