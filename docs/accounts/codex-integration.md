# Codex without an account: isolation and the execution lifecycle

Captured 2026-11-18 on codex-cli 0.165.0 (binary sha256
`a45099154d7fb4a5ed8a56f40966a95deb938e508bab23e6985035c709e9a85a`), with no account: every run used an empty `HOME`
and an empty `CODEX_HOME`, and an environment of only those two and `PATH`. Nothing here was signed in. The fixtures
are in `tests/Fixtures/Accounts/Codex`; doc 15 (sections 8, 12 and 13) holds the decisions they serve, doc 17 the final
ones, and [driver-capabilities.md](../hooks/driver-capabilities.md) the hook callbacks. Task 251 owns the procedure
with a real account; every claim below that needs one is marked missing, not assumed.

## Signed out

- `codex login status` prints `Not logged in` and exits 1.
- `codex exec --json` does **not** refuse locally. It starts a thread (`thread.started` with a `thread_id`), sends the
  turn to the API with no credential, reconnects five times on `401 Unauthorized: Missing bearer or basic
  authentication`, falls back from WebSockets to HTTPS, ends with `turn.failed` and **exits 0**
  (`exec-signed-out.jsonl`).

So the start checks the account before starting (`login status`, or `account/read` on the app-server) and never
starts `exec` on an account it has not checked. A run's outcome is read from the `turn.failed` or `turn.completed`
event, never from the exit status. Only that `Missing bearer` 401 is a checked signed-out shape; every other error text
is Unknown (doc 15, section 13).

## The app-server account and execution protocol

`codex app-server generate-json-schema` writes the protocol schema of 0.165.0 without signing in.

| Step | Request or notification | Fields |
|---|---|---|
| Start a sign-in | `account/login/start` with `type` `chatgpt` or `chatgptDeviceCode` | answers `loginId` with `authUrl`, or `loginId` with `userCode` and `verificationUrl` |
| Sign-in ends | `account/login/completed` | `success`, `loginId`, `error` |
| Cancel a sign-in | `account/login/cancel` with `loginId` | `status` `canceled` or `notFound` |
| Read the account | `account/read` with optional `refreshToken` | `account` (`chatgpt` with `email` and `planType`, or `apiKey`, `amazonBedrock`, `gcp`) or null, and `requiresOpenaiAuth` |
| Sign out | `account/logout` | |
| Start an execution | `thread/start` (`cwd`, `model`, `sandbox`, `approvalPolicy`, `config`, `ephemeral`); `thread/started` | the thread id |
| Run a turn | `turn/start` (`threadId`, `input` required; `cwd`, `model`, `effort`, `sandboxPolicy`); `turn/started`, `turn/completed` | the turn |
| Steer or stop a turn | `turn/steer`, `turn/interrupt` | |
| Refresh on the owner | `modelProvider/authRecoveryStarted`, `modelProvider/authRecoveryCompleted` | |

The other `login_start` types (`apiKey`, `chatgptAuthTokens`, `amazonBedrock*`) are outside the chosen browser-managed
account flow and are refused.

## The supported arrangement

The decision for task 236, with what is missing named:

1. **One authentication owner per account.** One `codex app-server` process, started with the account's `CODEX_HOME`
   and `cli_auth_credentials_store = "file"`, owns sign-in and refresh. Each journal session is one `thread/start` on
   it, each turn one `turn/start`. The journal's key for an execution is the thread id it started, recorded when
   `thread/started` arrives; a fork's or session tree's id is never an ownership key. A turn's end is its own
   `turn/completed`; stopping the owner ends every thread on it, which the host reports per thread.
2. **Separate processes only with evidence.** Several `codex exec` processes on one `auth.json` race their refresh;
   Codex's CI guide forbids sharing the file. They stay refused until task 251 shows a supported shared refresh.
3. **Missing native evidence**, each a prerequisite of shipping parallel Codex starts: whether app-server threads
   run the account's `hooks.json` hooks as `exec` does; whether two threads keep separate hook session identities;
   restart persistence of a sign-in and reuse by a later process; a refresh under parallel threads. Until task 251
   records them, parallel Codex starts are refused, not assumed.

## Usage on the Accounts page

A protected Codex start reports usage through its account generation's app-server owner
(`programs/runner/host/codex_owner.go`, decoders in `host/codex_usage.go`): a ChatGPT owner asks
`account/rateLimits/read` once and hears `account/rateLimits/updated`, keeping only the `codex` limit's primary and
secondary windows; an API-key owner (`account/read` type `apiKey`) asks for no limits and keeps each of its threads'
latest `thread/tokenUsage/updated` total.

**A contained Codex start has no usage reading yet.** It never uses that owner: a headless contained start runs
`codex exec --json` as its session container's own process, one per turn, and a terminal one runs the program on
the container's terminal. Neither carries app-server notifications to the host, and the host does not read a
contained Codex turn's output at all, so there is nothing of `account/rateLimits/updated` or
`thread/tokenUsage/updated` to decode. Starting a second app-server only to read usage is outside the design (doc 81),
so the contained Codex row shows no usage until its transport carries one of those readings.

## Work-folder trust and project configuration

A work folder must be trusted for Codex to run the journal's hooks (`projects."<path>".trust_level = "trusted"` in the
account's `config.toml`; macOS resolves `/tmp` to `/private/tmp`, so the exact resolved path is written). What 0.165.0
loads, checked with `codex mcp list` against a folder holding its own `.codex/config.toml` with an MCP server and a
model provider:

| Arrangement | Work-folder `.codex/config.toml` loaded |
|---|---|
| Folder untrusted | no |
| Exact folder trusted | **yes**: its MCP server is enabled |
| Exact folder trusted, an untrusted repository root above it holding its own `.codex/config.toml` | the root's layer no, the folder's own yes |
| Exact folder trusted, `-c mcp_servers={}` | yes: a command-line override merges into a table, it cannot empty it |
| Run outside any trusted folder inside a repository | Codex still reads that repository's `.codex/config.toml` as a project hooks file |
| Trusted empty journal-owned folder as the working root | nothing from the work folder |

No setting of 0.165.0 turns project layers off: its configuration knows `project_root_markers`, which moves the root,
but no switch that skips the layers of a trusted folder. Trusting an agent's work folder therefore lets an agent add
MCP servers, hooks and provider overrides by writing that folder's `.codex/config.toml`. The supported arrangement is
the last row: the working root is an empty, journal-owned, trusted folder, and the agent's work folder is given as a
writable `--add-dir` (or the thread's sandbox writable roots). That the hooks run and the work folder stays writable in
that arrangement needs a signed-in run (task 251). If it fails there, the mode is refused: the journal never trusts a
work folder an agent can write `.codex` into.

## What the program writes

A signed-out `exec` wrote into `CODEX_HOME` only: `installation_id`, `sessions/<year>/…` rollouts, the SQLite stores
(`state`, `logs`, `thread_history`, `memories`, `queue`, `goals`), `thread-writer-locks/.coordination.lock`,
`shell_snapshots/`, `skills/.system/` and plugin caches. `HOME` stayed empty. The other-session rule of doc 15 covers
`sessions/`, the SQLite stores and `shell_snapshots/`, not only the rollouts.

## Protected inventory

Codex 0.165.0 (tag rust-v0.165.0) dispatches every model tool call through one path:
`ToolRouter::build_tool_call` and `ToolRegistry::dispatch_any_with_state`, over the tools
`spec_plan.rs` `build_tool_router` registers. Tui, `exec`, `resume` and escalated calls share
it. Escalation and the retry after a sandbox denial only drop the sandbox wrapper
(`SandboxType::None`); they run through the same runtime.

| Route | Runs | Protected start |
|---|---|---|
| `exec_command` (pipe, one-shot, PTY with `tty: true`), `write_stdin` | `[shell, -lc, text]` via `UnifiedExecRuntime::run` | the remote environment: `process/start` to Codex's own `exec-server`, which journal-shell runs in the executor as uid 10002 |
| `apply_patch` tool and shell text `apply_patch …` | in-process through the environment's filesystem | the remote environment: `fs/*` to the executor |
| `view_image` | in-process read through the environment's filesystem | `features.view_image=false`, and remote anyway |
| `read_file`, `list_dir`, `grep_files` | not in 0.165.0 | none |
| MCP tools and resources | local stdio servers, unsandboxed | no `mcp_servers` in the isolated CODEX_HOME |
| code mode | JavaScript host child | `code_mode`, `code_mode_only` and `code_mode_host` off |
| collaboration tools | child agents | agent features off and the hook policy refuses them |
| `!cmd` user shell | local login shell, no sandbox, no approval | `include_local = false`: no local environment, so it fails closed |
| escalation and approvals | the same runtime without the sandbox wrapper | the journal never uses Codex's own sandbox: every start runs with `--dangerously-bypass-approvals-and-sandbox`, and uid 10002 plus the container are the boundary; an escalated call goes the same remote route |
| `exec resume` and `resume` | the thread's environments, read again from CODEX_HOME | the same `environments.toml`; a resumed thread's commands also ran as uid 10002 in the probe |
| extra arguments | whatever the caller adds | passed through to Codex as the user gave them |

The protected start writes `CODEX_HOME/environments.toml`, as root for uid 10001 before the container
starts, with one `[[environments]]` entry whose `program` is `/opt/journal/shell/bash` with
`args = ["-c", "exec codex exec-server --listen stdio"]`, `default` set to it, and `include_local = false`.
Shown in the agent image with a local mock model: a shell command, a PTY command and a resumed
thread's command report uid 10002, and a patch leaves a file owned by 10002 in `/workspace`. What the
real gpt-6 models are offered with code mode off is left to the acceptance run. The
command text reaches journal-shell unparsed, as the last argv element. If a run shows that a local
environment survives, or that a tool bypasses the selected environment, the integration becomes a
patch of `UnifiedExecRuntime::run`, `ExecCommandHandler::handle_call` (`intercept_apply_patch`),
`ApplyPatchRuntime::run` and `run_user_shell_command`. That patched build is qualified on its own;
until then Codex stays refused for protected starts.

## Checked and unchecked

| Claim | State |
|---|---|
| Version and binary digest | checked |
| Signed-out `login status` and `exec` shapes and exit codes | checked |
| App-server account and execution methods and fields | checked from the generated schema |
| Project configuration loading for untrusted, trusted and empty working roots | checked with `codex mcp list` |
| Hooks run under the empty-working-root arrangement with `--add-dir` | missing: needs sign-in (task 251) |
| App-server threads run account hooks with separate session identities | missing: needs sign-in |
| File backend keeps A, B and the personal login independent; restart and reuse | missing: needs sign-in |
| Parallel refresh on one `auth.json` | missing: needs sign-in; refused until shown |
| Device-code sign-in allowed by the account's policy | missing: needs sign-in |
