import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Upload } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Media Server" },
    {
      name: "description",
      content: "A media server",
    },
  ];
};

export async function loader() {
  const res = await fetch("http://localhost:4567/library");

  const json = await res.json();

  return { json };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const data = new FormData();
  data.append("file", file);
  const res = await fetch("http://localhost:4567/upload", {
    method: "POST",
    body: data,
  });
  return res.json();
};

export default function Index() {
  const { json } = useLoaderData<typeof loader>();

  console.log(json);

  return (
    <div className="container mx-auto space-y-12 p-4">
      <h1 className="text-4xl font-bold text-center mb-12">Media Server</h1>

      <Card className="border-gray-700">
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

      <div className="grid grid-cols-4 space-x-6">
        {json.map((track: Track) => {
          return (
            <Card className="border-gray-700" key={track.id}>
              <CardHeader>
                <CardTitle className="text-2xl">{track.title}</CardTitle>
              </CardHeader>
              <CardContent>{track.artist.name}</CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
