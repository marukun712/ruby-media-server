import { Edit, Trash2 } from "lucide-react";
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
import { Form } from "@remix-run/react";

export function AlbumHeader({ album }: { album: Album }) {
  return (
    <div className="flex items-center space-x-6">
      <img
        src={
          album.cover_url ||
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7QEZuxLo_zvFCMKLbMyH5pFU-LihRIeLXMY-QHxEMIgeNOVhvKeSMiNsIxrzNFHMsUv0nxYYl_b5RVqLtJcRgJokPMn8IVpkRDKfnrMr1dsoghyXHGXRakLCV1wX0FBGlltS5W34zMGV4/s400/no_image_square.jpg"
        }
        alt={album.title}
        className="w-48 h-48 shadow-lg"
      />
      <div>
        <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
        <p className="text-gray-400">
          {album.year} • {album.track_count}曲
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <EditAlbumForm album={album} />
        </div>
      </div>
    </div>
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
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" /> 編集
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>アルバムを編集</DialogTitle>
        </DialogHeader>
        <Form
          method="post"
          className="space-y-4"
          encType="multipart/form-data"
          action={`/api/album/edit/${album.id}`}
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              アルバムタイトル
            </label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="アルバムタイトルを入力"
              required
            />
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-300"
            >
              リリース年
            </label>
            <Input
              id="year"
              name="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="リリース年を入力"
            />
          </div>
          <div>
            <label
              htmlFor="cover_url"
              className="block text-sm font-medium text-gray-300"
            >
              カバー画像URL
            </label>
            <Input
              id="cover_url"
              name="cover_url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="カバー画像URLを入力"
            />
          </div>
          <div>
            <label
              htmlFor="track_count"
              className="block text-sm font-medium text-gray-300"
            >
              トラック数
            </label>
            <Input
              id="track_count"
              name="track_count"
              type="number"
              value={trackCount}
              onChange={(e) => setTrackCount(e.target.value)}
              placeholder="トラック数を入力"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              保存
            </Button>
          </div>
        </Form>
        <Form method="post" action={`/api/album/delete/${album.id}`}>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white mt-4"
            type="submit"
          >
            <Trash2 className="mr-2 h-4 w-4" /> アルバムを削除
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
