import type { Installation, InstallationStore } from "@slack/bolt";
import { kvStoreForTeam } from "./kvStore.ts";

// dd2030 以外の slack workspace で同時に動作させるのに必要。
// 現在は使っていない

export const installationStore: InstallationStore = {
  storeInstallation: async (installation) => {
    if (installation.team !== undefined) {
      await kvStoreForTeam(installation.team.id).child("installation").set(
        installation,
      );
      console.log("installation stored", installation);
      return;
    }
    throw new Error("Failed to save installation data to installationStore");
  },
  fetchInstallation: async ({ teamId }) => {
    if (teamId !== undefined) {
      return (await kvStoreForTeam(teamId).child<Installation>("installation")
        .get())!;
    }
    throw new Error("Failed to fetch installation");
  },
  deleteInstallation: async ({ teamId }) => {
    if (teamId !== undefined) {
      await kvStoreForTeam(teamId).child("installation").delelte();
      console.log("installation deleted for teamId", teamId);
      return;
    }
    throw new Error("Failed to delete installation");
  },
};
