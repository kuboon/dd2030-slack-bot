import Bolt from "@slack/bolt";
import { kvStoreForTeam } from "./kvStore.ts";
import { installationStore } from "./installationStore.ts";
const { App } = Bolt;
const scopes = [
  "app_mentions:read",
  "channels:history",
  "channels:join",
  "channels:read",
  "chat:write",
  "commands",
  "links:read",
  "links:write",
  "reactions:read",
  "users:read",
  "usergroups:read",
];

export const app = new App({
  clientId: "8530178454325.8803058460389",
  clientSecret: Deno.env.get("SLACK_CLIENT_SECRET"),
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
  stateSecret: Deno.env.get("SLACK_STATE_SECRET"),
  // token: Deno.env.get("SLACK_BOT_TOKEN"),
  scopes,
  installationStore,
});

app.use(({ context, next }) => {
  const teamId = context.teamId;
  if (teamId) {
    context.kv = kvStoreForTeam(teamId);
  }
  return next();
});
