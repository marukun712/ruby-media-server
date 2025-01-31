import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { TrackList } from "~/features/track/track";

function AlbumHeader({ album }: { album: Album }) {
  return (
    <>
      <div className="flex items-center justify-center">
        <img
          src={
            album.cover_url ||
            "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7QEZuxLo_zvFCMKLbMyH5pFU-LihRIeLXMY-QHxEMIgeNOVhvKeSMiNsIxrzNFHMsUv0nxYYl_b5RVqLtJcRgJokPMn8IVpkRDKfnrMr1dsoghyXHGXRakLCV1wX0FBGlltS5W34zMGV4/s400/no_image_square.jpg"
          }
          alt="thumbnail"
          className="w-96 h-96 p-6"
        />
        <h1 className="text-4xl font-bold mb-2 text-center">{album.title}</h1>
      </div>
      <h1 className="text-4xl font-bold mb-2 text-center">
        {album.year},{album.track_count}曲
      </h1>
    </>
  );
}

function EditAlbumForm({ album }: { album: Album }) {
  const [title, setTitle] = useState(album.title);
  const [year, setYear] = useState(album.year || "");
  const [coverUrl, setCoverUrl] = useState(album.cover_url || "");
  const [trackCount, setTrackCount] = useState(album.track_count || "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mx-auto block">Edit Album</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Album</DialogTitle>
        </DialogHeader>
        <Form
          method="post"
          className="space-y-4"
          encType="multipart/form-data"
          action={`/api/album/edit/${album.id}`}
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Album Title
            </label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter album title"
              required
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium">
              Release Year
            </label>
            <Input
              id="year"
              name="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter release year"
            />
          </div>
          <div>
            <label htmlFor="cover_url" className="block text-sm font-medium">
              Cover URL
            </label>
            <Input
              id="cover_url"
              name="cover_url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Enter cover image URL"
            />
          </div>
          <div>
            <label htmlFor="track_count" className="block text-sm font-medium">
              Track Count
            </label>
            <Input
              id="track_count"
              name="track_count"
              type="number"
              value={trackCount}
              onChange={(e) => setTrackCount(e.target.value)}
              placeholder="Enter track count"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit">Save</Button>
          </div>
        </Form>
        <Form method="post" action={`/api/album/delete/${album.id}`}>
          <Button className="bg-red-500 text-white" type="submit">
            アルバムを削除
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const res = await fetch(`http://localhost:4567/album/${id}`);
  const json = await res.json();
  return { json };
}

export default function Album() {
  const { json: album } = useLoaderData<{ json: Album }>();

  return (
    <div>
      <AlbumHeader album={album} />
      <TrackList tracks={album.tracks} />
      <EditAlbumForm album={album} />
    </div>
  );
}
