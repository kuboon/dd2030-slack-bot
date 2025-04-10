# dd2030 Slack Bot
https://github.com/slackapi/bolt-js のインスタンスです。
開発環境として deno を使用し、 deno deploy へデプロイしています。

```
// Listen for an action from a Block Kit element (buttons, select menus, date pickers, etc)
app.action(actionId, fn);

// Listen for dialog submissions
app.action({ callback_id: callbackId }, fn);

// Listen for slash commands
app.command(commandName, fn);

// Listen for an event from the Events API
app.event(eventType, fn);

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
