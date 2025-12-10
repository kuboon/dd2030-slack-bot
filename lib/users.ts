import { cache } from "./cache.ts";
import { Member, slackApiClientFor } from "./apiClient.ts";

function getAllUsersWithBots(teamId: string) {
  return cache(`${teamId}.users.list`, async () => {
    const allUsers: Member[] = [];
    let cursor: string | undefined;

    do {
      const response = await slackApiClientFor(teamId).then((x) =>
        x.users.list({ cursor, limit: 100 })
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.error}`);
      }

      allUsers.push(...response.members!);
      cursor = response.response_metadata?.next_cursor;
    } while (cursor);
    return allUsers;
  });
}
export async function getAllUsers(teamId: string) {
  const users = await getAllUsersWithBots(teamId);
  return users.filter((user) =>
    user.id !== "USLACKBOT" && !user.is_bot && !user.deleted
  );
}
