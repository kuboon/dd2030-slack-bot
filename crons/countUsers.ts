import { slackApiClient } from "../lib/apiClient.ts";
import { getAllUsers } from "../lib/users.ts";

const usersCountKey = (date: string) => ["usersCount", date];
export async function run() {
  const today = new Date().toISOString().split("T")[0];
  const yesterday =
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const users = await getAllUsers();
  using kv = await Deno.openKv(Deno.env.get("KV_URL"));
  const lastCount = (await kv.get(usersCountKey(yesterday))).value as number ||
    0;
  await kv.set(usersCountKey(today), users.length);

  const diff = users.length - lastCount;

  const message = diff > 0
    ? `📈 今日は${diff}人増えました！`
    : diff < 0
    ? `📉 今日は${Math.abs(diff)}人減りました…`
    : `😃 メンバー数は変わりませんでした！`;

  const text =
    `📊 *${today} メンバー数定点観測*\n デジタル民主主義2030メンバー数: ${users.length}人（前日比: ${diff}人）\n${message}`;

  await slackApiClient.chat.postMessage({
    channel: "C08QLT17362", // 8_人数推移
    text,
  });
}

if (import.meta.main) {
  try {
    await run();
    console.log("User count updated successfully.");
  } catch (error) {
    console.error("Error updating user count:", error);
  }
}
