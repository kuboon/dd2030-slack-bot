import { type App } from "../deps.ts";
import { slackApiClientFor } from "../lib/apiClient.ts";
import { TeamSettings } from "../lib/teamSettings.ts";

const welcomeMessages = {
  [TeamSettings.mirai.teamId]: {
    "C0A8XMNT6FM":
      `<@{user}>さん、<#C0A8XMNT6FM>へ参加いただき、ありがとうございます！こちらの目標は、公式アカウントから投稿される動画や、ファンメイドの動画をたくさん作って投稿していくことです:dart:最初の第一歩として、以下をご確認ください:point_down:

    <https://team-mirai-volunteer.slack.com/docs/T08R1043FPY/F0A9478UAR5|はじめにお読みください>をご確認ください:eyes:
    困ったらとりあえず <@U0914GXMU8Y> をメンションしてください :raised_hands:（軽い気持ちで頼っていただけると嬉しいです:bangbang:）`,
  },
};

export function init(app: App) {
  app.event("member_joined_channel", async ({ event, context }) => {
    console.log("member_joined_channel event:", event.user, event.channel);
    const teamId = context.teamId;
    if (!teamId) return;
    const messages = welcomeMessages[teamId] as
      | Record<string, string>
      | undefined;
    if (!messages) return;
    try {
      const channelId = event.channel;
      const template = messages[channelId];
      if (!template) return; // no configured message for this team/channel

      const userId = event.user;
      if (!userId) return;

      const client = await slackApiClientFor(teamId);

      const text = template.replace(/{user}/g, userId).replace(
        /<@\{user\}>/g,
        `<@${userId}>`,
      );

      // Open an IM channel and send a DM
      const imOpen = await client.conversations.open({ users: userId });
      if (!imOpen.ok || !imOpen.channel) return;
      const dmChannel = imOpen.channel.id!;

      await client.chat.postMessage({ channel: dmChannel, text });
    } catch (err) {
      console.error("welcomeChannel handler error:", err);
    }
  });
}
