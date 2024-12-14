# Gojek Roast 🛵🔥

Made using Next.js, shadcn/ui, and OpenAI gpt-4o-mini.
Deployed on Cloudflare Workers using the [@opennextjs/cloudflare](https://www.npmjs.com/package/@opennextjs/cloudflare) adapter.

No databases since we don't store any data!

## Local dev

You can keep on using `npm run dev`/`next dev`, or switch to `npm run preview` (preferred). The latter
allows you to run locally using the Workers runtime, rather than Node.js.
This allows you to test changes in the same runtime as the app will run in when deployed to Cloudflare.
