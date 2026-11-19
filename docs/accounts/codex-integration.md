# Codex without an account: isolation and the execution lifecycle

Captured 2026-11-18 on codex-cli 0.165.0 (binary sha256
`a45099154d7fb4a5ed8a56f40966a95deb938e508bab23e6985035c709e9a85a`), with no account: every run used an empty `HOME`
and an empty `CODEX_HOME`, and an environment of only those two and `PATH`. Nothing here was signed in. The fixtures
are in `tests/Fixtures/Accounts/Codex`; doc 15 (sections 8, 12 and 13) holds the decisions they serve, doc 17 the final
ones, and [program-capabilities.md](../hooks/program-capabilities.md) the hook callbacks. Task 251 owns the procedure
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
