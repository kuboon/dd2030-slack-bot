import { app } from "./lib/bolt.ts";

// JST 09:05 に実行。 9時より前だと Date がずれるので念の為。
let cronCount = 0;
Deno.cron("countUsers", "5 0 * * *", async () => {
  cronCount++;
  console.log("running cron: count=", cronCount)
  await import("./crons/countUsers.ts").then((x) => x.run());
});

await import("./modules/hello.ts").then((x) => x.init(app));
await import("./modules/intro.ts").then((x) => x.init(app));

await app.start();
console.log("⚡️ Bolt app is running!");
