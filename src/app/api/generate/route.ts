import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const images = formData.getAll("file");
  console.log(images.length, images);

  return new Response("File uploaded!", { status: 200 });
}
