import type { Installation, InstallationStore } from "@slack/bolt";

// dd2030 以外の slack workspace で同時に動作させるのに必要。
// 現在は使っていない

const keyForTeamId = (teamId: string) => ["installations", teamId];
export const installationStore: InstallationStore = {
  storeInstallation: async (installation) => {
    if (installation.team !== undefined) {
      using kv = await Deno.openKv();
      await kv.set(
        keyForTeamId(installation.team.id),
        installation,
      );
      console.log("installation stored", installation);
      return;
    }
    throw new Error("Failed to save installation data to installationStore");
  },
  fetchInstallation: async ({ teamId }) => {
    if (teamId !== undefined) {
      using kv = await Deno.openKv();
      return (await kv.get<Installation>(keyForTeamId(teamId))).value!;
    }
    throw new Error("Failed to fetch installation");
  },
  deleteInstallation: async ({ teamId }) => {
    if (teamId !== undefined) {
      using kv = await Deno.openKv();
      await kv.delete(keyForTeamId(teamId));
      console.log("installation deleted for teamId", teamId);
      return;
    }
    throw new Error("Failed to delete installation");
  },
};
