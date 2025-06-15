import { type App } from "../deps.ts";
import type { Message } from "../lib/apiClient.ts";
import type { KvStore } from "../lib/kvStore.ts";
import { getTeamSetting } from "../lib/teamSettings.ts";

export const introKey = (userId: string) => ["intro", userId];

export function init(app: App<{ kv: KvStore }>) {
  app.event("message", async ({ context, event, next }) => {
    if (event.subtype && event.subtype !== "message_changed") return;
    const channel = getTeamSetting(context.teamId)?.channels?.intro;
    if (channel === event.channel) await next();
  }, async ({ context, event }) => {
    if (event.subtype === "message_changed" && !event.message.subtype) {
      const userId = event.message.user;
      await context.kv.child(...introKey(userId)).set(event.message);
      return;
    }
    if (event.subtype) return;
    await context.kv.child(...introKey(event.user)).set(event);
  });
  app.command("/intro", async ({ ack, command, context, respond }) => {
    await ack();
    const match = command.text.match(/^\s*<@([^|>]+)(\|(.+))?>\s*$/);
    if (!match || !match[1]) {
      await respond({
        response_type: "ephemeral",
        text:
          "自己紹介を取得したいユーザーをメンションの形で指定してください 例: `/intro @user`",
      });
      return;
    }
    const userId = match[1];
    console.log("intro command for user:", userId);
    const message = await context.kv.child<Message>(...introKey(userId)).get();
    if (!message) {
      await respond({
        response_type: "ephemeral",
        text: `ユーザー <@${userId}> の紹介が見つかりませんでした。`,
      });
      return;
    }
    await respond({
      response_type: "ephemeral",
      blocks: message.blocks!,
      text: message.text,
    });
  });
}
