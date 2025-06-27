import { type Message, slackApiClientFor } from "./apiClient.ts";
import { kvStoreForTeam } from "./kvStore.ts";
import { TeamSetting, TeamSettings } from "./teamSettings.ts";

async function getAllMessages(
  teamId: string,
  channel: string,
  opts: { oldest?: string } = {},
): Promise<Message[]> {
  const allMessages: Message[] = [];
  let cursor: string | undefined;
  using file = await Deno.open("messages.json", { append: true, create: true });
  do {
    const response = await slackApiClientFor(teamId).then((x) =>
      x.conversations.history({
        channel,
        limit: 100,
        cursor,
        ...opts,
      })
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch conversation history: ${response.error}`,
      );
    }
    const messages = response.messages!.filter(
      (msg: Message): msg is Message =>
        !!msg.text && !!msg.user && !msg.subtype && !msg.thread_ts,
    );
    const textEncoder = new TextEncoder();
    messages.forEach((msg: unknown) => {
      file.write(textEncoder.encode(JSON.stringify(msg) + "\n"));
    });

    allMessages.push(...messages);
    cursor = response.response_metadata?.next_cursor;
    console.log(`Fetched ${allMessages.length} messages so far...`);
  } while (cursor);
  await Deno.writeTextFile(
    "messages.json",
    JSON.stringify(allMessages, null, 2),
  );
  return allMessages;
}

async function saveMessagesToKv(teamSetting: TeamSetting) {
  const kvStore = kvStoreForTeam(teamSetting.teamId).child("intro");
  const messages = await getAllMessages(
    teamSetting.teamId,
    teamSetting.channels.intro,
    // { oldest: "1748917492.354679" },
  );
  for (const message of messages) {
    if (!message.user) continue; // Skip messages without a user
    if (message.text) {
      await kvStore.child(message.user).set(message);
    }
  }
}

if (import.meta.main) {
  try {
    await saveMessagesToKv(TeamSettings.mirai);
    console.log("Messages saved to KV successfully.");
  } catch (error) {
    console.error("Error saving messages to KV:", error);
  }
}
