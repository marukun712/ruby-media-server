import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Player from "~/features/player/player";

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
  const { json: library } = useLoaderData<{ json: Album[] }>();

  return (
    <div className="container mx-auto space-y-12 p-6">
      <a href="/client/home">
        <h1 className="text-4xl font-bold text-center mb-12">Media Server</h1>
      </a>
      <Player />

      <Outlet context={{ library }} />
    </div>
  );
}
