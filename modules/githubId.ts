import type { App } from "../deps.ts";
import { matchMessage } from "../deps.ts";
import { getAllUsers } from "../lib/users.ts";

export function init(app: App) {
  app.event(
    "app_mention",
    matchMessage(/github (.+)/),
    async ({ say, context }) => {
      if (!context.userId) return;
      const { githubId, userId } = await getUserIdFromGithub(context[0]);
      const text = userId
        ? `${githubId} は <@${userId}> のGitHub IDです。`
        : `${githubId} の持ち主は不明です。`;
      await say({
        text,
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text },
          },
        ],
      });
    },
  );
}

async function getUserIdFromGithub(githubIdOrUrl: string) {
  const githubId = githubIdOrUrl.match(/https:\/\/github\.com\/(.+)/)?.[1] ||
    githubIdOrUrl;
  const slackUsers = await getAllUsers();
  const userId = slackUsers.find((user) => user.githubId === githubId)?.id;
  return { githubId, userId };
}
