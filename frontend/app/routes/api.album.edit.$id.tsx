import { ActionFunction, redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  const formData = await request.formData();

  await fetch(`http://backend:4567/album/edit/${id}`, {
    method: "POST",
    body: formData,
  });

  return redirect("/");
};
