import { slackApiClientFor } from "../lib/apiClient.ts";
import { getAllUsers } from "../lib/users.ts";
import { kvStoreForTeam } from "../lib/kvStore.ts";
import { TeamSetting, TeamSettings } from "../lib/teamSettings.ts";

export function run() {
  return Promise.all(
    Object.values(TeamSettings).map((teamSetting) =>
      runForTeam(teamSetting),
    ),
  );
}
async function runForTeam(teamSetting: TeamSetting) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday =
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const users = await getAllUsers(teamSetting.teamId);
  const kv = kvStoreForTeam(teamSetting.teamId).child("usersCount");
  const lastCount = (await kv.child<number>(yesterday).get()) || 0;
  await kv.child(today).set(users.length);

  const diff = users.length - lastCount;
  if (diff === 0) return;

  const text =
    `📊 *${today}* メンバー数: ${users.length}人（前日比: ${diff}人）`;

  const slackApiClient = await slackApiClientFor(teamSetting.teamId);
  await slackApiClient.chat.postMessage({
    channel: teamSetting.channels.userStats!,
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
