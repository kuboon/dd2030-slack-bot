import { slackApiClient } from "./apiClient.ts";

type HistoryResponse = Awaited<
  ReturnType<typeof slackApiClient.conversations.history>
>;
type Message = NonNullable<HistoryResponse["messages"]>[number];

const introKey = (userId: string) => ["intro", userId];
const channel = "C08HKET1YG3"; // 1_自己紹介
async function getAllMessages(
  opts: { oldest?: string } = {},
): Promise<Message[]> {
  const allMessages: Message[] = [];
  let cursor: string | undefined;
  do {
    const response = await slackApiClient.conversations.history({
      channel,
      limit: 100,
      cursor,
      ...opts,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch conversation history: ${response.error}`,
      );
    }

    allMessages.push(
      ...response.messages!.filter((msg): msg is Message =>
        !!msg.text && !!msg.user && !msg.subtype
      ),
    );
    cursor = response.response_metadata?.next_cursor;
    console.log(`Fetched ${allMessages.length} messages so far...`);
  } while (cursor);
  await Deno.writeTextFile(
    "messages.json",
    JSON.stringify(allMessages, null, 2),
  );
  return allMessages;
}

async function saveMessagesToKv() {
  const messages = await getAllMessages({ oldest: "1748917492.354679" });
  using kv = await Deno.openKv(Deno.env.get("KV_URL"));
  for (const message of messages) {
    if (!message.user) continue; // Skip messages without a user
    if (message.text) {
      await kv.set(introKey(message.user), message);
    }
  }
}

export async function getIntro(userId: string) {
  using kv = await Deno.openKv();
  const result = await kv.get(introKey(userId));
  if (result.value) {
    return result.value as Message;
  } else {
    return null;
  }
}

if (import.meta.main) {
  try {
    await saveMessagesToKv();
    console.log("Messages saved to KV successfully.");
  } catch (error) {
    console.error("Error saving messages to KV:", error);
  }
}

// todo https://api.slack.com/events/channel_history_changed を受信して kv を更新する
