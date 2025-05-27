# dd2030 Slack Bot

https://github.com/slackapi/bolt-js のインスタンスです。 開発環境として
[deno](https://docs.deno.com/runtime/#install-deno) を使用しています。
[codespace](https://codespaces.new/kuboon/dd2030-slack-bot?quickstart=1) や
devcontainer から起動した場合、 deno はインストール済みです。

`main` ブランチへ push すると、自動的に
[deno deploy](https://dash.deno.com/projects/dd2030-slack-bot)
へデプロイされます。 deno deploy へのアクセス権をご希望の方は dash.deno.com
へ一度アクセスしてアカウントを作成した後、 @kuboon へ一報ください。

# 機能の追加方法

新機能を追加する場合は、 modules 以下に専用のファイルを作成し、 `main.ts`
に以下のような行を追加してください。

```ts
(await import("./modules/hello.ts")).init(app);
```

具体的な実装方法は [hello.ts](./modules/hello.ts) と bolt-js
のリファレンスを参考にしてください。

# cheatsheet

```js
// Listen for an action from a Block Kit element (buttons, select menus, date pickers, etc)
app.action(actionId, fn);

// Listen for dialog submissions
app.action({ callback_id: callbackId }, fn);

// Listen for slash commands
// 要 bot config
app.command(commandName, fn);

// Listen for an event from the Events API
// list of events https://api.slack.com/events?filter=Events
// イベントが来ない場合、 bot の subscription が不足している可能性があります。
// bot 管理者へ依頼してください。
app.event("app_mention", async ({ say, context }) => {
  await say(`Hello <@${context.user}>!`);
});


// Listen for a custom step execution from a workflow
app.function(callbackId, fn)

// Convenience method to listen to only `message` events using a string or RegExp
app.message([pattern ,] fn);

// Listen for options requests (from select menus with an external data source)
app.options(actionId, fn);

// Listen for a global or message shortcuts
app.shortcut(callbackId, fn);

// Listen for view_submission modal events
app.view(callbackId, fn);
```
