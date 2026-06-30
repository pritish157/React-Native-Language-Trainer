import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

export async function POST(request: Request) {
  try {
    const { userId, userName } = await request.json();

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!apiKey || !apiSecret) {
      return Response.json({ error: "Stream API keys not configured on server" }, { status: 500 });
    }

    const streamClient = new StreamClient(apiKey, apiSecret);
    
    // Generate token valid for 4 hours (14400 seconds)
    const token = streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 4 * 60 * 60,
    });

    return Response.json({
      token,
      apiKey,
      userId,
      userName: userName || userId,
    });
  } catch (error: any) {
    console.error("Error in stream-token API:", error);
    return Response.json({ error: error.message || "Failed to generate token" }, { status: 500 });
  }
}
