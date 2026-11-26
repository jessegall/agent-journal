# Start handshake: which accounts can run credential-free in a container

This file holds the evidence behind `docs/accounts/container-capabilities.json`, the matrix `RecordedHostCapabilities` answers from. Only a row marked `supported`, with its evidence recorded, may start. Every other row, and every combination without a row, is refused with `account-container-unsupported`: no process is released, no account is changed and nothing falls back to the host or to API billing (doc 14, sections 58 and 61).

## The question asked of each pinned client

Can the program run entirely inside an admitted container, reaching its provider through a host-owned, credential-free adapter that:

- keeps the doc 15 account and its one refresh owner on the host,
- keeps the explicitly selected model and the program's own conversation behaviour,
- mounts only the agent's own account folder into the agent's own container, as the user decided (question 30), and
  passes no token through the environment or arguments,
- does not switch to API billing?

Running the program on the host and only its tools in a container does not answer yes (doc 14, section 61).

## What was checked

On 2026-11-18, on the development machine, with the pinned builds of `docs/hooks/driver-capabilities.md`. Only the programs' own help was read: nothing signed in, nothing was started and no account folder was touched.

```text
$ claude --version
2.1.323 (Claude Code)
$ codex --version
codex-cli 0.165.0
$ claude auth --help
Commands:
  login [options]   Sign in to your Anthropic account
  logout            Log out from your Anthropic account
  status [options]  Show authentication status
$ claude gateway --help
Usage: claude gateway [options]
Run the enterprise auth/telemetry gateway
Options:
  --config <path>  Path to gateway YAML config
$ codex login --help
      --with-api-key        Read the API key from stdin
      --with-access-token   Read the access token from stdin
$ codex app-server --help
  daemon   Manage the local app-server daemon
  proxy    Proxy stdio bytes to the running app-server control socket
$ codex exec-server --help
[EXPERIMENTAL] Run the standalone exec-server service
  forward  Register an existing WebSocket exec-server as a remote environment
```

The vendor documentation read for doc 15 (sections 7 and 8) describes the same account stores: Claude Code keeps a claude.ai login in the macOS Keychain or `.credentials.json` per config folder, and Codex keeps a managed ChatGPT login in `auth.json` under `CODEX_HOME` (or a keyring), refreshed by the program itself.

## Claude Code in a required container

Status: supported, by the account mount the user decided on (question 30).

- The subscription login lives in the program's own account store, `.credentials.json` in the account folder. That
  folder, and no other, is mounted into the agent's own container, where Claude Code signs in and refreshes it itself
  ([contained-capability-runs.md](contained-capability-runs.md#account-transport-supported)).
- `claude setup-token` is not used: it prints a long-lived token that would sit in the container's environment.
- `claude gateway` is not needed for this route.

## Codex in a required container

Status: supported, by the same account mount (question 30).

- The managed ChatGPT login lives in `auth.json` under the account's `CODEX_HOME`, refreshed by the program. That
  folder, and no other, is mounted into the agent's own container.
- `codex login --with-api-key` and `--with-access-token` are not used: they put a credential in the environment, and
  an API key switches to API billing.
- `codex app-server`, `codex remote-control` and `codex exec-server forward` keep the agent on the host and only its
  tools elsewhere, which doc 14 section 61 does not accept; they are not used.

## The protected host

Status: unverified for both programs.

The protected host (task 258, [host-installation.md](host-installation.md)) claims, prepares, starts, stops and
reconciles account starts, but it starts none yet: neither program's protected arrangement is available on any host
(the journal's protection report of the host names what is missing, [host-protection.md](host-protection.md)), so every account start
is refused before release. The rows stay unverified until the native evidence procedures show the arrangement hold;
only then may `ProgramCompatibility` mark a build, platform and arrangement native shown.

## Changing a row

A row becomes `supported` only with a native run recorded here: the exact commands, the redacted output and proof that each point of the question above holds. A newer pinned build gets its own check; until then its rows are unverified.

Required-container admission checks the account transport before the runtime, so an unverified or unsupported
account combination answers `account-container-unsupported` before account selection or host preparation.
Activating a required-container profile that names a program checks the same evidence. A profile with no program
supplies policy for a later selection. Every required-container start checks its selected program again.
The launch network, protected bridge, and native launch evidence are tracked in task 1357, which depends on
the protected host in task 258.

## Process starts on an account

Every launch on a saved account registers a process start in its launch transaction, after the agent's lifecycle
lock and the program's selection and account locks, and before any process exists (`RegisterPendingStart`,
`ProcessStart`). The host owns the process; the journal never opens a host folder. The enrolled host talks to these
routes over its own signed transport (`journal.host`: its bearer secret plus the per-call signature), never with an
agent's launch token, and every write runs through the bus as the journal itself (`CommandEntry::HostControl`):

| Route | Command | What it does |
|---|---|---|
| `POST /host/starts/claim` (`session_id`) | `ClaimStart` | hands the session's pending start to this host once: its key, the account folder on the host and the sign-in generation; a start already taken, cancelled by maintenance or of an ended session answers 410 and no process may start |
| `POST /host/starts/{start}/running` (`execution_id`) | `ReportRunning` | records the process, or the thread on the account's sign-in owner, as the start's execution |
| `POST /host/starts/{start}/stopped` | `ReportStopped` | ends the start once the host proved its process exited, or that it made none |
| `POST /host/starts/{start}/failure` (`failure`) | `ReportFailure` | ends the start and publishes the checked failure as `ProgramFailed` |
| `GET /host/starts` | read | the host's starts that may still have a process, for its restart |
| `POST /host/starts/reconcile` (`stopped`) | `ReconcileStarts` | ends only the named starts the host proved gone |

A start is bound to the host that claimed it; another host's reports find nothing. Repeated reports change nothing.
A start the host never names stays unresolved, so a missing process id or a lost host never ends one, and account
maintenance waits for it. The protected host claims, spawns and reconciles these starts (task 258); until a program's
protected arrangement is shown no start is spawned, and a pending start is not a running process.

### The recipe a claim carries

`ClaimStart` asks the program's adapter for the start's account settings (`AccountSettingsRequested`, answered by
`App\Listeners\SupplyAccountSettings`); Agents itself knows no program. The adapter reads the program's
`ProgramCompatibility` and refuses the claim with `ProgramArrangementUnproven` (409, the start stays pending) unless
the real program showed its arrangement; the recipe also names the build and arrangement it holds for, so the host
refuses a different binary. The recipe never names a host path but the account folder; the host writes the per-launch
files itself.

| Program | Environment | Empty folder | Removed | Flags | Account configuration |
|---|---|---|---|---|---|
| Claude Code | `CLAUDE_CONFIG_DIR` = account folder | `ANTHROPIC_CONFIG_DIR` | `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN` | `--restricted`, `--strict-mcp-config`, `--mcp-config`, `--settings`, `--tools` | none |
| Codex | `CODEX_HOME` = account folder | none | `OPENAI_API_KEY`, `CODEX_API_KEY` | `app-server`, `--add-dir` | `cli_auth_credentials_store = "file"` |

The journal's own `JOURNAL_*` hook environment is unchanged by the recipe and set by the launcher as before.

### Codex folder trust

Codex runs the journal's hooks only in a trusted folder, and a trusted folder's own `.codex/config.toml` loads with
it (see [codex-integration.md](codex-integration.md)). So the host trusts only an empty working root the journal
made, never an agent's work folder and never a parent: `CodexFolderTrust::forWorkingRoot` refuses a folder outside
the working roots folder, a link, or one that already holds anything. The work folder is given to the thread as a
writable extra folder instead.

`AccountConfigurationWrite::addTrust` adds that trust to the account's `config.toml` on the host: under a short lock
file beside it, it reads the latest file, keeps every entry (hooks, the file sign-in store, earlier trusts), adds only
the new `[projects."<exact path>"]` table and replaces the file with one rename, so a reader sees the old or the new
file whole and a failed write leaves the old one. It never stops or waits for running threads. The lock serialises
writers; it is not what keeps project settings out, the empty root is. Whether the pinned build runs the hooks in such
a root, and keeps hostile work-folder files out after trust, later edits and a second concurrent worker, is the
`hooks-run-in-empty-root` item of the Codex native evidence; until it passes the Codex arrangement stays refused.
