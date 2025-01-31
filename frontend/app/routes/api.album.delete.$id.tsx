import { ActionFunction, redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ params }) => {
  const { id } = params;

  await fetch(`http://localhost:4567/album/delete/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return redirect("/client/home");
};
