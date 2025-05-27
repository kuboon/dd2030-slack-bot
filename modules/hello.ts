import { type App, matchMessage } from "../deps.ts";

export function init(app: App) {
  app.event(
    "app_mention",
    matchMessage(/hi|やっほー/),
    async ({ say, context }) => {
      if (!context.userId) return;
      // say() sends a message to the channel where the event was triggered
      const text = `やっほー <@${context.userId}>!`;
      await say({
        text,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text,
            },
          },
        ],
      });
    },
  );
}
