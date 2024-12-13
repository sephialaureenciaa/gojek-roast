import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  console.log(file.name);
  return new Response("File uploaded!", { status: 200 });
}
