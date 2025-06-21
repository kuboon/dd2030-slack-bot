import { SlackAPIClient } from "@seratch/slack-web-api-client";
import type {
  ConversationsHistoryResponse,
  UsersListResponse,
} from "@seratch/slack-web-api-client";
import { installationStore } from "./installationStore.ts";
import { InstallationQuery } from "../deps.ts";

export { SlackAPIClient };
export async function slackApiClientFor(teamId: string) {
  const installation = await installationStore.fetchInstallation(
    { teamId } as InstallationQuery<false>,
  );
  return new SlackAPIClient(installation.bot?.token);
}

export type Message = NonNullable<
  ConversationsHistoryResponse["messages"]
>[number];
export type Member = NonNullable<UsersListResponse["members"]>[number];
