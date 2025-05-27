import { SlackAPIClient } from "@seratch/slack-web-api-client";
export const slackApiClient = new SlackAPIClient(
  Deno.env.get("SLACK_BOT_TOKEN")!,
);
