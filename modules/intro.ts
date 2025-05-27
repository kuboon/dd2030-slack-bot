import { type App, matchMessage } from "../deps.ts";
import { getIntro } from "../lib/intro.ts";

export function init(app: App) {
  app.event(
    "app_mention",
    matchMessage(/intro <@(.+?)>/),
    async ({ say, context }) => {
      const userId = context.matches[1];
      if (!userId) return;
      const message = await getIntro(userId);
      if (!message) {
        await say({
          text: `ユーザー <@${userId}> の紹介が見つかりませんでした。`,
        });
        return;
      }
      await say({ blocks: message.blocks!, text: message.text });
    },
  );
}
