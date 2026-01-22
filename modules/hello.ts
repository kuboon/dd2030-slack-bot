import { type App, matchMessage } from "../deps.ts";

export function init(app: App) {
  app.event(
    "app_mention",
    matchMessage(/hello|hi|やっほー/),
    async ({ context, event, say }) => {
      if (!context.userId) return;
      // say() sends a message to the channel where the event was triggered
      const text = `やっほー <@${context.userId}>!
      event.text: ${event.text}`;
      await say({
        text,
        thread_ts: event.thread_ts,
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
