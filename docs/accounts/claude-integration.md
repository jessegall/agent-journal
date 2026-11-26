# Claude Code without an account: what the pinned program does

Captured 2026-11-18 on Claude Code 2.1.323 (binary sha256
`5432918d904a9b6afef7bb79d20df24d76052eabc1f41bceb84091d21f8889a7`), with no account: every run used an empty `HOME`,
an empty `CLAUDE_CONFIG_DIR` and an empty `ANTHROPIC_CONFIG_DIR`, and an environment of only those three and `PATH`.
Nothing here was signed in, and no run reached the API (`duration_api_ms` 0, `total_cost_usd` 0). This is evidence
about the program, not about protection: a capture installs no protected binary and proves no sandbox. The fixtures
are in `tests/Fixtures/Accounts/Claude`; doc 15 (sections 7, 12 and 20) holds the decisions they serve, and doc 17 the
final ones. The hook callbacks themselves are in [driver-capabilities.md](../hooks/driver-capabilities.md).

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
| `--restricted` | removes the built-in code-running tools (Bash, PowerShell and the like) and WebFetch unless `--tools` names them; ignores user, project and local settings files (managed settings and `--settings` still apply); confines file tools to the working directories and `--add-dir`; refuses `bypassPermissions`; only a user or the configured permission handler approves writes to settings, git and tool-configuration files |
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
- A protected start sets `CLAUDE_CODE_SHELL=/opt/journal/shell/bash` from Claude Code's start profile
  (`profiles/claude_code.go`, `Environment` when `Start.Protected`), and `RejectContrary` refuses an argument naming
  another shell, a shell prefix or a config folder (task 1760).

## Managed policy

The journal hands each contained session `resources/agents/claude-code-managed-settings.json` with its start grant, and its container mounts that file read-only at `/etc/claude-code/managed-settings.json`
(written by the host as root, mode 0644, and mounted read-only; the Linux managed path of the settings documentation). The program's user 10001 can read the account
folder, so Claude Code's own file tools must never be pointed at it; the policy does that, and nothing a project, a
user or a launch writes can loosen it:

- `allowManagedPermissionRulesOnly`, `allowManagedHooksOnly` and `allowManagedMcpServersOnly` make the managed allow,
  ask and deny rules, hooks and MCP allowlist the only ones in force; rules in a project's `.claude/settings.json`, the
  user's settings and the launch's `--settings` file are ignored. The policy therefore carries the launch's own rules
  itself: the delegation and nested-program denies, the noninteractive allow list, the journal's MCP tools and its hook
  on every event. `TestTheManagedPolicyCarriesEveryRuleAndHookOfTheLaunch` (`profiles`) fails when the two drift.
- `allowedMcpServers` names only the journal's server; `permissions.disableBypassPermissionsMode` is `disable`.
- File rules are allowed only under `/workspace` and `/tmp`; reads and edits are denied under `/home`, `/root`,
  `/proc`, `/dev/fd`, `/run` and `/sys`, edits under `/etc` and `/opt`, and reads of `/etc/claude-code`.

Every path-taking tool of the start's tool list, and what covers it:

| Tool | Opens | Covered by |
|---|---|---|
| Read | the file it names | `Read` rules; a symlink is judged by its target |
| Edit, Write | the file it names | `Edit` rules, and `Read` denies, which also refuse writing |
| NotebookEdit | the notebook it names | `Edit` rules; it also needs the notebook read first, which the `Read` deny refuses |
| Grep, Glob | the folder they search | `Read` rules |
| Bash | anything, as the executor's user 10002 | the shell bridge (section Shell handoff) and file modes; paths in a command are also checked against the `Read` denies |
| WebFetch | only `http` and `https` URLs | a `file:` URL is refused as invalid before any read |
| WebSearch, ToolSearch | no local file | nothing to cover |

No tool had to leave the list for protected starts.

Checked in the arm64 agent image as 10001, with the shell bridge and the executor running, against a fake Messages
API that issued one tool call per turn and recorded each answer (scratchpad probe `policy/`; the launch's `--settings`
and a workspace `.claude/settings.json` both allowed `Read(//home/**)` and `Edit(//home/**)`):

- Read of `/workspace/marker.txt` answered its text; Write of `/workspace/written.txt` and NotebookEdit of a workspace
  notebook succeeded; `ls /workspace` through Bash answered the listing.
- Refused before access, each with `File is in a directory that is denied by your permission settings` or
  `Permission to read ... has been denied`: Read of `/home/journal/.account/.credentials.json`, of its `.backup`, of
  `/workspace/account-link/.credentials.json` and `/workspace/credentials-link.json` (links into the account folder),
  of `/proc/self/root/home/journal/.account/.credentials.json`, `/proc/self/environ`, `/dev/fd/0` and
  `/workspace/../home/journal/.account/.credentials.json`; Grep and Glob of the account folder; Write and Edit in it,
  and Write through the workspace link (`File is covered by a Read deny rule`); NotebookEdit through the link; Bash
  `ls -la /home/journal/.account`.
- WebFetch of `file:///home/journal/.account/.credentials.json` answered `Invalid URL`, also with WebFetch allowed.
- The two settings files that allowed the account folder changed none of these answers.

## Protected inventory

Every action the model or a message to it can take in Claude Code 2.1.323 under the protected-account profile, how
it is reached and what closes it. Lines are `programs/agent/profiles/claude_code.go` unless named; the managed
policy is `resources/agents/claude-code-managed-settings.json` (section Managed policy).

| Route | Reached by | Closed by | Where |
|---|---|---|---|
| Bash | the model | runs as uid 10002 through the shell bridge; paths in a command are checked against the `Read` denies | `CLAUDE_CODE_SHELL`, line 50 and `Environment`; managed `permissions.deny` |
| Read, Edit, Write | the model | managed `Read`/`Edit` rules: only `/workspace` and `/tmp`, account, `/proc`, `/dev/fd`, `/run`, `/sys` denied | managed policy |
| NotebookEdit | the model (deferred) | managed `Edit` rules, and a notebook must be read first | managed policy |
| WebFetch, WebSearch | the model (deferred) | no local file: a `file:` URL answers `Invalid URL` | section Managed policy |
| ToolSearch | the model | finds only the deferred tools of `--tools`: a `select:` of Agent, Task, Skill, Grep and Glob answered WebFetch, WebSearch and NotebookEdit | `--tools`, lines 26 and 91 |
| Agent, Task, Workflow, SendMessage, ListAgents, RemoteTrigger | the model | left out of `--tools`, named in `--disallowedTools` and denied in the managed policy | lines 29 and 91; managed `deny` |
| Built-in subagents (Explore, general-purpose, Plan, statusline-setup) | the Agent tool | listed at start but unreachable: no Agent or Task tool; `--agents {}` adds none | line 90 |
| Skills and the Skill tool | the model | the Skill tool is left out and denied; skills in the workspace's `.claude/skills` do not load | line 29; resume check below |
| Slash commands | the user typing in the terminal | not model-controlled; workspace `.claude/commands` do not load | resume check below |
| Nested programs | Bash | `Bash(claude:*)`, `Bash(codex:*)` and the print forms denied | line 60; managed `deny` |
| Project, user and local settings | files in the workspace or home | `--setting-sources ''`, and `allowManagedPermissionRulesOnly` ignores every rule outside the managed file | line 89; managed policy |
| Hooks | settings files | `allowManagedHooksOnly`: only the managed hooks, the image's `journal-hook` with fixed arguments, run | managed policy |
| MCP servers | `.mcp.json`, settings, `--mcp-config` | `--strict-mcp-config`, the one journal descriptor, `allowManagedMcpServersOnly` with `allowedMcpServers` naming only `journal` | lines 97 and 253; managed policy |
| Permission prompts and approvals | the user answering a prompt | `allowManagedPermissionRulesOnly` hides the always-allow choices and saves no rule, so an approval allows one call and adds no directory | managed policy |
| Added directories | `/add-dir`, typed by the user | `--restricted`; file rules still stop at `/workspace` and `/tmp` | line 100; managed policy |
| Bypass mode | `--dangerously-skip-permissions`, `--permission-mode` | `disableBypassPermissionsMode: disable`; `RejectContrary` refuses both arguments | line 342; managed policy |
| A shell, shell prefix or config folder of the launch's choosing | extra arguments | `RejectContrary` refuses `CLAUDE_CODE_SHELL`, `shellPrefix` and `CLAUDE_CONFIG_DIR` | line 340 |
| `@path` attachments in a prompt | a message the journal hands the agent | no attachment of a denied path reached the API: a prompt naming `@/home/journal/.account/.credentials.json` and a workspace link into the account sent no byte of the planted credential | resume check below |
| Image paste | the user in the terminal | not model-controlled; a pasted image is the user's own | none needed |
| Resume | `--resume <session>` | the same arguments and managed policy apply; the resumed session listed the same tools and no MCP server | line 111; resume check below |

No route is left open.

Checked in the arm64 agent image as uid 10001, with the shell bridge, the executor and the managed policy, against
the fake Messages API (scratchpad probe `policy/routes.sh`). The workspace held a `.claude/settings.json` with a
PreToolUse and a SessionStart hook writing `/workspace/HOOK_RAN`, `enableAllProjectMcpServers` and an allow rule for
the account folder; a `.mcp.json` server writing `/workspace/MCP_RAN`; and a planted agent, skill and command. A
first session started with `--session-id` and was then resumed with `--resume`:

- neither marker file was written, and both sessions reported `mcp_servers: []` and the tools Bash, Edit,
  NotebookEdit, Read, ToolSearch, WebFetch, WebSearch and Write;
- the planted agent, skill and command appeared in no list; the lists held only Claude Code's built-in ones;
- ToolSearch found only WebFetch, WebSearch and NotebookEdit; Read of the workspace marker answered and Read of the
  account's credentials was refused, before and after the resume;
- no request to the API carried the planted credential, with both `@` paths in the prompt.

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
| Native file tools never reach the account folder, whatever a project or launch allows | checked for one-shot | section Managed policy, fake API in the agent image |
| No workspace hook, MCP server, agent, skill or command loads, also after a resume | checked for one-shot and resume | section Protected inventory, fake API in the agent image |
| An agent reads its own saved output but no other session's or the credentials | unchecked: needs sign-in and the protected host | task 250 and the starter |
| Model commands cannot read the Keychain entry | unchecked: needs sign-in | task 250 |
