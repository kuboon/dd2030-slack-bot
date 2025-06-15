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

async function saveMessagesToKv(teamSetting: TeamSetting) {
  const kvStore = kvStoreForTeam(teamSetting.teamId).child("intro");
  const messages = await getAllMessages(
    teamSetting.teamId,
    teamSetting.channels.intro,
    { oldest: "1748917492.354679" },
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
    await saveMessagesToKv(TeamSettings.dd2030);
    console.log("Messages saved to KV successfully.");
  } catch (error) {
    console.error("Error saving messages to KV:", error);
  }
}
