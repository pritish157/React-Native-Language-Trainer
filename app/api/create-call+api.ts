import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

export async function POST(request: Request) {
  try {
    const {
      callId,
      userId,
      lessonId,
      languageId,
      goals,
      vocabulary,
      phrases,
      aiTeacherPrompt,
      callType = "audio_room",
    } = await request.json();

    if (!callId || !userId) {
      return Response.json({ error: "Missing callId or userId" }, { status: 400 });
    }

    if (!apiKey || !apiSecret) {
      return Response.json({ error: "Stream API keys not configured on server" }, { status: 500 });
    }

    const streamClient = new StreamClient(apiKey, apiSecret);
    const call = streamClient.video.call(callType, callId);

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [{ user_id: userId, role: "admin" }],
        custom: {
          lessonId,
          languageId,
          goals,
          vocabulary,
          phrases,
          aiTeacherPrompt,
        },
      },
    });

    return Response.json({
      success: true,
      callId,
      callType,
    });
  } catch (error: any) {
    console.error("Error creating call:", error);
    return Response.json({ error: error.message || "Failed to create call" }, { status: 500 });
  }
}
