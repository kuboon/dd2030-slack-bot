import { type App, matchMessage } from "../deps.ts";
import { getIntro } from "../lib/intro.ts";

export function init(app: App) {
  app.command("intro", async ({ command, ack, respond }) => {
    await ack();
    const match = command.text.match(/^\s*<@(.+?)>\s*$/);
    if (!match || !match[1]) {
      await respond({
        response_type: "ephemeral",
        text: "自己紹介を取得したいユーザーをメンションの形で指定してください 例: `/intro @user`",
      });
      return;
    }
    const userId = match[1];
    const message = await getIntro(userId);
    if (!message) {
      await respond({
        response_type: "ephemeral",
        text: `ユーザー <@${userId}> の紹介が見つかりませんでした。`,
      });
      return;
    }
    await respond({ response_type: "ephemeral", blocks: message.blocks!, text: message.text });
  });
}
