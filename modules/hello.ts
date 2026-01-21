import { type App, matchMessage } from "../deps.ts";

export function init(app: App) {
  app.event(
    "app_mention",
    matchMessage(/hello|hi|やっほー/),
    async ({ context, event, say }) => {
      if (!context.userId) return;
      // say() sends a message to the channel where the event was triggered
      // const text = `やっほー <@${context.userId}>!
      // event.text: ${event.text}`;
      const text = `<@${context.userId}>さん、#サポーター映像部 のチャンネルへ参加いただき、ありがとうございます！こちらの目標は、公式アカウントから投稿される動画や、ファンメイドの動画をたくさん作って投稿していくことです:dart:最初の第一歩として、以下をご確認ください:point_down:

    はじめにお読みくださいをご確認ください:eyes:
    困ったらとりあえず <@tahashika>（たはしか） をメンションしてください:raised_hands:（軽い気持ちで頼っていただけると嬉しいです:bangbang:）`
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
