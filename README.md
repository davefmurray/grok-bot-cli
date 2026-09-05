# grok-bot-cli

[![npm version](https://img.shields.io/npm/v/grok-bot-cli.svg)](https://www.npmjs.com/package/grok-bot-cli)

Manage [Grok Bot](https://cursor.com/help/grok-bot/plans) agents, groups, and messages from your terminal.

![Live create, group, send, and delete smoke test](https://raw.githubusercontent.com/ScriptedAlchemy/grok-bot-cli/main/demo/grok-bot-cli-demo.gif)

[Watch the MP4](https://github.com/ScriptedAlchemy/grok-bot-cli/blob/main/demo/grok-bot-cli-demo.mp4)

## Install

```sh
npm install --global grok-bot-cli
```

Requires Node.js 18+ and the Grok Bot macOS app. Open Grok Bot and sign in once; `gbot` automatically uses the app's encrypted session and routing credentials. No token copying is required.

## Use

```sh
gbot bots list
gbot bots create --name Researcher
gbot bots update Researcher --description "Research the launch" --notify on
gbot bots create --name Writer
gbot groups create --name Launch --member Researcher --member Writer --description "Ship together"
gbot groups update Launch --title "Launch room" --hidden off
gbot send Researcher "Summarize the launch status."
gbot send Launch "Share your updates."
gbot thread Researcher
gbot groups delete Launch
gbot bots delete Researcher
gbot bots delete Writer
```

`update` fields: `--name` `--description`/`--instructions` `--title` `--avatar-shape` `--avatar-color` `--notify` `--hidden`. `--description` is the UI Instructions field.

Run `gbot --help` for every command.

## Local history

Successful `send` commands save the prompt locally. `thread` and `chat` save the
messages returned by the gateway, including replies, without the terminal display's
400-character truncation. History is plain-text JSONL at
`~/.grok-bot-cli/history.jsonl`: one message observation per line, with the target
ID/name, role, text, command, and recording time. Message IDs, message timestamps,
and the requested thread root are included when available.

```bash
gbot send Researcher "Investigate the startup timeout"
gbot thread Researcher
gbot history Researcher --search timeout
gbot history --search timeout --limit 100 --json
grep -in 'timeout' "$(gbot history --path)"
```

`history` works offline, without app credentials. It shows the last 40 matching
records in recording order; `--limit` changes that count. The optional target
matches an exact ID or a case-insensitive full name. `--search` is a
case-insensitive literal text search. `--json` returns an array with full text.
JSONL escapes embedded newlines, so multiline prompts remain one searchable line.

Use `--history-dir DIR` or `GROK_BOT_HISTORY_DIR` to choose another directory (the
flag takes precedence). New directories are created with mode `0700` and new
files with mode `0600`. Existing directory permissions are left unchanged.
History contains the conversation text, including any sensitive information you
put in messages. Gateway credentials and raw response metadata are not recorded.
Disable recording for a command with `--no-history`, or for all commands with
`GROK_BOT_HISTORY=off` (`false` and `0` also work):

```bash
gbot --no-history send Researcher "Do not record this prompt locally"
export GROK_BOT_HISTORY=off
```

The opt-out affects local recording only; the gateway still receives the command,
and existing local history remains readable. To remove local history, delete the
file reported by `gbot history --path`. There is no automatic expiry.

This is a record of CLI observations, not a background sync or a conversation
resume mechanism. Replies are captured when you run `thread`/`chat`; the default
fetch is the latest 40 messages (`thread --limit N` requests more). Repeated fetches
append repeated observations, and a sent prompt can appear again when fetched.
Messages never fetched by this CLI are not backed up. Local write failures warn
on stderr without turning a successful gateway operation into a failed command.

## License

MIT
