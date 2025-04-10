import Bolt from "@slack/bolt";
const { App } = Bolt;

const app = new App({
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
  token: Deno.env.get("SLACK_BOT_TOKEN"),
});

/* Add functionality here */

(async () => {
  // Start the app
  await app.start(Deno.env.get("PORT") || 3000);

  console.log("⚡️ Bolt app is running!");
})();
