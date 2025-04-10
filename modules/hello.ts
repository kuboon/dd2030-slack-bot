import type { App } from "@slack/bolt";

export default function hello(app: App) {
  app.message(/ハロー/, async ({ say, context }) => {
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
  });
}
