import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const res = await fetch(`http://localhost:4567/artist/${id}`);

  const json = await res.json();

  return { json };
}

export default function Album() {
  const { json: artist } = useLoaderData<{ json: Artist }>();

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold mb-2 text-center">{artist.name}</h1>
      </div>

      <div className="grid grid-cols-4 space-x-6 my-12">
        {artist.albums.map((album: Album) => {
          return (
            <a href={`/client/album/${album.id}`} key={album.id}>
              <Card className="border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl">{album.title}</CardTitle>
                </CardHeader>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
