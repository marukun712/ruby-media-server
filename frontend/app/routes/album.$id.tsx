import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TrackList } from "~/components/track/track";
import Main from "~/components/layout/main";
import { AlbumHeader } from "~/components/album/album";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const res = await fetch(`http://backend:4567/album/${id}`);
  const json = await res.json();
  return { json };
}

export default function Album() {
  const { json: album } = useLoaderData<{ json: Album }>();

  return (
    <Main>
      <AlbumHeader album={album} />
      <div className="p-6">
        <TrackList tracks={album.tracks} image={album.cover_url!} />
      </div>
    </Main>
  );
}
