import Bolt from "@slack/bolt";
const { App } = Bolt;
// const scopes = [
//   "app_mentions:read",
//   "channels:history",
//   "channels:read",
//   "commands",
//   "links:read",
//   "links:write",
//   "users:read",
//   "usergroups:read",
// ];

export const app = new App({
  clientId: "8530178454325.8803058460389",
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
  token: Deno.env.get("SLACK_BOT_TOKEN"),
});
