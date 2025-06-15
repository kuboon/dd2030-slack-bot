import { SlackAPIClient } from "@seratch/slack-web-api-client";
import { installationStore } from "./installationStore.ts";
import { InstallationQuery } from "../deps.ts";

export async function slackApiClientFor(teamId: string) {
  const installation = await installationStore.fetchInstallation(
    { teamId } as InstallationQuery<false>,
  );
  return new SlackAPIClient(installation.bot?.token);
}

type HistoryResponse = Awaited<
  ReturnType<SlackAPIClient["conversations"]["history"]>
>;
export type Message = NonNullable<HistoryResponse["messages"]>[number];

type UsersListResponse = Awaited<ReturnType<SlackAPIClient["users"]["list"]>>;
export type Member = NonNullable<UsersListResponse["members"]>[number];
