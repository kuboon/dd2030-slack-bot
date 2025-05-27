import { cache } from "./cache.ts";
import { slackApiClient } from "./apiClient.ts";

type UsersListResponse = Awaited<ReturnType<typeof slackApiClient.users.list>>;
type Member = NonNullable<UsersListResponse["members"]>[number];
function getAllUsersWithBots() {
  return cache("users.list", async () => {
    const allUsers: Member[] = [];
    let cursor: string | undefined;

    do {
      const response = await slackApiClient.users.list({ cursor, limit: 100 });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.error}`);
      }

      allUsers.push(...response.members!);
      cursor = response.response_metadata?.next_cursor;
    } while (cursor);
    return allUsers;
  });
}
export async function getAllUsers() {
  const users = await getAllUsersWithBots();
  return users.filter((user) => user.id !== "USLACKBOT" && !user.is_bot && !user.deleted);
}
