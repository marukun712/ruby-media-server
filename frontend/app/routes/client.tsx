import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const file = formData.get("file") as File;

  const data = new FormData();
  data.append("file", file);

  const res = await fetch("http://localhost:4567/upload", {
    method: "POST",
    body: data,
  });

  const json = await res.json();

  console.log(json);

  return json;
};

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <Form action="/client" method="post" encType="multipart/form-data">
        <Input type="file" name="file"></Input>
        <Button type="submit">POST</Button>
      </Form>
    </div>
  );
}
