import { Form, useOutletContext } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Upload } from "lucide-react";

export default function Home() {
  const { library } = useOutletContext<{ library: Album[] }>();

  return (
    <div>
      <Card className="border-gray-700 my-12">
        <CardHeader>
          <CardTitle className="text-2xl">ファイルアップロード</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            action="/client"
            method="post"
            encType="multipart/form-data"
            className="space-y-4"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">ファイルを選択</Label>
              <Input
                id="file"
                type="file"
                name="file"
                className="bg-gray-700 text-white"
              />
            </div>
            <Button type="submit" className="w-full">
              <Upload className="mr-2 h-4 w-4" /> アップロード
            </Button>
          </Form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 grid-rows-4">
        {library.map((album: Album) => {
          return (
            <Card className="border-gray-700 w-62 m-6" key={album.id}>
              <a href={`/client/album/${album.id}`}>
                <img
                  src={
                    album.cover_url ||
                    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7QEZuxLo_zvFCMKLbMyH5pFU-LihRIeLXMY-QHxEMIgeNOVhvKeSMiNsIxrzNFHMsUv0nxYYl_b5RVqLtJcRgJokPMn8IVpkRDKfnrMr1dsoghyXHGXRakLCV1wX0FBGlltS5W34zMGV4/s400/no_image_square.jpg"
                  }
                  alt="thumbnail"
                  className="p-6"
                ></img>
                <CardHeader>
                  <CardTitle className="text-2xl">{album.title}</CardTitle>
                </CardHeader>
              </a>

              <a href={`/client/artist/${album.artist_id}`}>
                <CardContent>{album.artist.name}</CardContent>
              </a>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
