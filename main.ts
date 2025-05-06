import type { Installation, InstallationStore } from "@slack/bolt";
import Bolt from "@slack/bolt";
const { App } = Bolt;

type Query = { teamId: string | undefined };
export const installationStore: InstallationStore = {
  storeInstallation: async (installation: Installation) => {
    if (installation.team !== undefined) {
      using kv = await Deno.openKv();
      await kv.set(
        ["installations", installation.team.id],
        installation,
      );
      console.log("installation stored", installation);
      return;
    }
    throw new Error("Failed to save installation data to installationStore");
  },
  fetchInstallation: async ({ teamId }: Query) => {
    if (teamId !== undefined) {
      using kv = await Deno.openKv();
      return (await kv.get<Installation>(["installations", teamId])).value!;
    }
    throw new Error("Failed to fetch installation");
  },
  deleteInstallation: async ({ teamId }: Query) => {
    if (teamId !== undefined) {
      using kv = await Deno.openKv();
      await kv.delete(["installations", teamId]);
      return;
    }
    throw new Error("Failed to delete installation");
  },
};

const app = new App({
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
  token: Deno.env.get("SLACK_BOT_TOKEN"),
  installationStore,
});

(await import("./modules/hello.ts")).default(app);

(async () => {
  // Start the app
  await app.start(Deno.env.get("PORT") || 3000);

  console.log("⚡️ Bolt app is running!");
})();
