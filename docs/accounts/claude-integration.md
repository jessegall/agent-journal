# Claude Code without an account: what the pinned program does

Captured 2026-11-18 on Claude Code 2.1.323 (binary sha256
`5432918d904a9b6afef7bb79d20df24d76052eabc1f41bceb84091d21f8889a7`), with no account: every run used an empty `HOME`,
an empty `CLAUDE_CONFIG_DIR` and an empty `ANTHROPIC_CONFIG_DIR`, and an environment of only those three and `PATH`.
Nothing here was signed in, and no run reached the API (`duration_api_ms` 0, `total_cost_usd` 0). This is evidence
about the program, not about protection: a capture installs no protected binary and proves no sandbox. The fixtures
are in `tests/Fixtures/Accounts/Claude`; doc 15 (sections 7, 12 and 20) holds the decisions they serve, and doc 17 the
final ones. The hook callbacks themselves are in [program-capabilities.md](../hooks/program-capabilities.md).

## The start invocation

```
env -i PATH=<protected PATH> HOME=<journal home> \
  CLAUDE_CONFIG_DIR=<account directory> ANTHROPIC_CONFIG_DIR=<empty journal directory> \
  claude -p --restricted \
    --strict-mcp-config --mcp-config <journal mcp.json> \
    --settings <journal settings.json> \
    --tools "<approved native tools>" \
    --model <model> --session-id <uuid> \
    --output-format stream-json --include-hook-events \
    "<prompt>"
```

2.1.323 accepts every one of these flags together. Signed out, the run ends at once with `is_error: true`,
`terminal_reason: api_error` and the result `Not logged in · Please run /login`
(`restricted-print-signed-out.json`): an empty account directory never falls back to another credential source.

## What the help of 2.1.323 says

| Flag or command | What it does, per `claude --help` |
|---|---|
| `--restricted` | removes the built-in code-running tools (Bash, PowerShell and the like) and WebFetch unless `--tools` names them; ignores user, project and local settings files (managed settings and `--settings` still apply); confines file tools to the working directories and `--add-dir`; refuses `bypassPermissions`; only a person or the configured permission handler approves writes to settings, git and tool-configuration files |
| `--strict-mcp-config` | only MCP servers from `--mcp-config` load; all other MCP configuration is ignored |
| `--tools` | the list of available built-in tools; `""` disables all |
| `--settings` | a settings file or JSON string |
| `--setting-sources` | which of user, project, local load; the earlier hook capture used `local`, which reads the work folder's `.claude/settings.local.json` and is not the start configuration |
| `--bare` | skips hooks, keychain reads and OAuth; auth only by `ANTHROPIC_API_KEY` or `apiKeyHelper`, so not usable with a subscription login |
| `--safe-mode` | disables customizations (hooks, MCP servers, plugins); not usable, since the journal's hooks must run |
| `--session-id`, `--no-session-persistence` | a chosen session UUID; no transcript written (print mode only) |
| `--permission-prompts none` | in print mode, anything that would prompt is denied |
| `auth login` | `--claudeai` (default), `--console`, `--email`, `--sso` |
| `auth status` | `--json` (default) or `--text`; signed out it exits 1 |
| `auth logout`, `setup-token` | account commands an agent must never reach |

Signed out, `auth status --json` answers (`auth-status-signed-out.json`) with `loggedIn`, `authMethod` (`none`),
`apiProvider`, `configDirectory` and `projectsDirectory` (both inside `CLAUDE_CONFIG_DIR`) and `loginExpiresAt`. The
start's pre-check reads these fields: a signed-in account must report `authMethod` `claude.ai` and the expected
`configDirectory`.

## MCP tool names

A session of 2.1.323 lists its MCP discovery and resource tools by these native names: `ToolSearch`,
`ListMcpResourcesTool`, `ReadMcpResourceTool` and `ReadMcpResourceDirTool`; an MCP tool is named
`mcp__<server>__<tool>`. The hook adapter recognizes exactly these (task 323). Codex 0.165.0 keeps the same
`mcp__<server>__<tool>` identifiers and names its own `tool_search`, `list_mcp_resources`,
`list_mcp_resource_templates` and `read_mcp_resource`; that comes from its binary, not yet from a captured hook payload.

## What the program writes

Every file the program wrote lies inside `CLAUDE_CONFIG_DIR`: `.claude.json` (mode 0600; keys `firstStartTime`,
`firstStartVersion`, `machineID`, `migrationVersion` and migration flags, no credential), `backups/`,
`plugins/store/<built-in plugin>.json` and an empty `sessions/`. `HOME` and `ANTHROPIC_CONFIG_DIR` stayed empty. With
`--no-session-persistence` no `projects/` transcript folder was made; a persisted session writes its transcript under
`projectsDirectory`.

## Shell handoff

Observed on 21 November in the agent image (`.docker/helper/Dockerfile`, Claude Code 2.1.323, linux/amd64), with no
sign-in: `claude -p` ran as uid 10001 against a local fake Messages API that asked for one Bash tool call, the command
`GREETING=hello; echo "$GREETING $HOME" > /workspace/redirected.txt; echo piped | tr a-z A-Z; sleep 1 & id -u; pwd`.
`CLAUDE_CODE_SHELL_PREFIX` and `CLAUDE_CODE_SHELL` each pointed at a script that recorded its arguments, working folder
and parent.

- **The shell must be named `bash`.** A `CLAUDE_CODE_SHELL` script under another name was never called; the same
  script installed as `.../bash` was.
- **The shell is started as a login shell, twice per session.** First `bash -c env` (the environment snapshot), then for
  the tool call `bash -c -l "<prefix> '<script>'"`, in the session's working folder, as uid 10001.
- **The prefix gets one argument, the whole script.** `CLAUDE_CODE_SHELL_PREFIX` is called with argc 1:
  `{ \builtin shopt -u extglob || \builtin setopt NO_EXTENDED_GLOB ...; } >/dev/null 2>&1 || true && { \builtin unalias
  -- 'which'; ... } && eval '<the model's command>' < /dev/null && pwd -P >| /tmp/claude-<id>-cwd`. The model's command
  arrives single-quoted inside `eval`, unexpanded.
- **So a prefix alone does not protect.** The login shell named by `CLAUDE_CODE_SHELL` reads its startup files and
  parses the line `<prefix> '<script>'` as uid 10001 before the prefix runs. The bridge therefore takes the shell's
  place: `/opt/journal/shell/bash` is `cmd/journal-shell`, which reads the `-c` string (`shellbridge.CommandOf`), parses
  nothing, and hands it to the executor, which runs `/bin/bash -c <string>` as uid 10002 in the workspace with its own
  fixed environment and no startup files. A prefix set anywhere then also runs inside the executor.
- **Through the bridge**, the same tool call printed `PIPED`, `10002` and `/workspace`; `redirected.txt` was owned by
  10002 with group journal-work (10010), mode 0660, holding `hello /home/journal-tools`; Claude Code read the output and
  exit code 0, and its `pwd -P` file under `/tmp` was written without an error.
- A protected-account container sets `CLAUDE_CODE_SHELL=/opt/journal/shell/bash` (`host/container.go`); the managed
  settings must keep a project's settings from naming another shell (task 1760).

## Checked and unchecked

| Claim | State | How |
|---|---|---|
| Version and binary digest | checked | `claude --version`, sha256 of the installed binary |
| Flags of the start invocation exist and combine | checked | the signed-out print run above |
| An empty account directory gives no credential | checked | `loggedIn: false`, `authMethod: none`, `Not logged in` with no API call |
| All program writes stay in `CLAUDE_CONFIG_DIR` | checked for signed-out runs | file listing of the three directories |
| `--restricted` ignores work-folder settings and confines file tools | from the help only | needs a signed-in run with a work-folder `.claude/settings.json` |
| Journal hooks run under `--restricted` with `--settings` | unchecked | needs a signed-in run |
| Account A and B use separate Keychain entries, and deleting one leaves the other | unchecked: needs sign-in | task 250's native procedure |
| `authMethod claude.ai` and `configDirectory` of a signed-in account | unchecked: needs sign-in | task 250 |
| Parallel starts on one account share a refresh safely | unchecked: needs sign-in | task 250 |
| Bash tool commands run as the executor user, not the program user | checked for one-shot | section Shell handoff, fake API in the agent image |
| An agent reads its own saved output but no other session's or the credentials | unchecked: needs sign-in and the protected host | task 250 and the starter |
| Model commands cannot read the Keychain entry | unchecked: needs sign-in | task 250 |
