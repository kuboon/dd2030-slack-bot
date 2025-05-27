import { app } from "./lib/bolt.ts";

// JST 09:01 に実行。 9時より前だと Date がずれるので念の為。
Deno.cron("sample cron", "1 0 * * *", async () => {
  (await import("./crons/countUsers.ts")).run();
});

(await import("./modules/hello.ts")).init(app);
(await import("./modules/intro.ts")).init(app);

await app.start();
console.log("⚡️ Bolt app is running!");
