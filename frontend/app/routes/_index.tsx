import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Main from "~/components/layout/main";
import { Card, CardContent } from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [{ title: "Starlight" }];
};

export async function loader() {
  const res = await fetch("http://backend:4567/library");
  const json = await res.json();
  return { json };
}

export default function Index() {
  const { json: library } = useLoaderData<{ json: Album[] }>();

  return (
    <Main>
      <h2 className="text-2xl font-bold mb-4">あなたのライブラリ</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {library.map((album: Album) => (
          <Card
            key={album.id}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition duration-300"
          >
            <a href={`/album/${album.id}`} className="block">
              <img
                src={
                  album.cover_url ||
                  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7QEZuxLo_zvFCMKLbMyH5pFU-LihRIeLXMY-QHxEMIgeNOVhvKeSMiNsIxrzNFHMsUv0nxYYl_b5RVqLtJcRgJokPMn8IVpkRDKfnrMr1dsoghyXHGXRakLCV1wX0FBGlltS5W34zMGV4/s400/no_image_square.jpg"
                }
                alt={album.title}
                className="w-full aspect-square object-cover rounded-t-lg"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{album.title}</h3>
                <a
                  href={`/artist/${album.artist_id}`}
                  className="text-sm text-gray-400 hover:underline"
                >
                  {album.artist.name}
                </a>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>
    </Main>
  );
}
