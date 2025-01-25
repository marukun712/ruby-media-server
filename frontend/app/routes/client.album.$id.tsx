import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PlayButton from "~/components/button/playButton";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

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
      <div>
        <h1 className="text-4xl font-bold mb-2 text-center">{album.title}</h1>
      </div>

      <div className="w-1/2 mx-auto space-y-6 my-12">
        {album.tracks.map((track: Track) => {
          return (
            <Card className="border-gray-700" key={track.id}>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <PlayButton title={track.title} id={track.id} />
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
