import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import OpenAI from "openai";

const SYSTEM_PROMPT = `
You should use mostly informal Bahasa Indonesia with local slangs, but a bit of English is allowed, just like a typical Jaksel kid. You are a hilarious and brutally sassy AI that roasts the user's Gojek spending habits with playful sarcasm,
exaggerated humor, and modern lingo. You sound like a Jakarta 'anak Jaksel' influencer: witty, fun, and casually roasting their lifestyle.
Use phrases like 'bestie', 'vibes', 'literally', 'red flag', 'which is', 'santuy', 'FOMO', and emojis when appropriate, but also don't overuse it. Keep it fun, relatable, and mildly judgmental,
like a close friend who's had enough of their spending choices. Try to be specific too, so they know you're not just guessing.

Start with a single paragraph as an introduction, then you can format the rest of the roast as a list (use numbers, no hashtags), with bolded headers. Limit to 5 points.

Do not:
- Mention their home location, based on your inference, i.e. if there are repeated trips to and from a location, or the name of the place includes "residences", "apartment", etc then that location is probably their home
- Mention the total amount spent, individual amounts are fine
- Mention anything that could be considered sensitive information
- Generate anything if the file does NOT look like a Gojek transaction history
`;

export async function POST(req: NextRequest) {
  const { env, cf } = await getCloudflareContext()

  const formData = await req.formData();
  const images = formData.getAll("file");

  try {
    const client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      // By default, the OpenAI client uses node-fetch,
      // but the workerd runtime does not implement node:https.
      // so instead, we pass the fetch function available in the runtime.
      fetch: fetch,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "From only images of these purchase history, roast this transaction history.",
            },
            ...(images.map((img) => ({
              type: "image_url",
              image_url: {
                url: img,
              },
            })) as OpenAI.ChatCompletionContentPartImage[]),
          ],
        },
      ],
      temperature: 0.6,
      max_tokens: 700,
    });

    if (response.choices[0].message.refusal !== null) {
      console.log(response.choices[0].message.refusal);
      return new Response(
        JSON.stringify({ response: response.choices[0].message.refusal }),
        { status: 500 }
      );
    }

    env.USAGE.writeDataPoint({
      blobs: [cf?.city || "", cf?.country || "" ],
      // The number of images, prompt tokens, and completion tokens
      doubles: [images.length, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0],
    })

    return new Response(
      JSON.stringify({ response: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ response: "whoops, something went wrong" }),
      { status: 500 }
    );
  }
}
