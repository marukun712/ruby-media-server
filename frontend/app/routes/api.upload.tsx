import { ActionFunction } from "@remix-run/node";
import { redirect } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const data = new FormData();

  if (file.type !== "audio/*") {
    return redirect("/");
  }

  data.append("file", file);
  await fetch("http://backend:4567/upload", {
    method: "POST",
    body: data,
  });

  return redirect("/");
};
