# Program capabilities

This is the one place where the journal records what it knows about each agent program's hooks. A `ProgramCapabilities` value in the code records the contract an adapter was written against; this file records the evidence behind it. A program version is supported only when every row of its matrix below is filled from a captured, redacted fixture of that version.

## What plan 2 delivered, and what it did not

The core is built and tested on PostgreSQL: typed hook inputs, the top-first walk with recorded steps, the role bottom states, the state types and restoration, the rewrite recheck, the two Hooks tables with versioned casts, the per-request agent scope, the bounded stack transaction with replay, the domain states pushed by their own listeners, the authoritative shell parser, the Claude Code and Codex adapters, the authenticated endpoint `POST /hooks/{program}`, launches with isolated settings and separate child stacks, compaction once with reminders, loss confirmation, the outage replies, the read-only inspector `GET /hooks/stacks/{agentId}/{sessionId}` and retention.

No production program runs under it yet: the host relay exists but has not run under a real program. Task 89 pinned Claude Code 2.1.323 and codex-cli 0.165.0 and captured their hook payloads on 2026-11-17, each run headless under isolated settings with a capture hook that answered every callback with `{}`; the fixtures are those payloads, redacted. What the capture could not show (the replies a program accepts, timeouts, the stop cap) is marked below as not verified. The owner work still missing is listed in `docs/hooks/dependencies.md`.

## Native subagents are never started (rule 36)

The prohibition is permanent: only the journal's own helpers and workers are ever started, never a program's native subagent, team or forked skill. Each program's `HookProgram::nativeChildTools()` lists the tools that start or reach another agent; the launch settings deny every one, and `POST /hooks/{program}` refuses a pre-tool call to any of them, and any call from inside a native child (one that carries `agent_id`), before a session is mapped or a stack is touched.

## Measured limits

Measured on 2026-11-17 against the running FrankenPHP Octane app in Docker, from the host, 50 calls each:

| What | Median | Worst |
|---|---|---|
| The health check `/up` | 1.7 ms | 6.7 ms |
| A hook call with an unknown token, refused at the credential lookup | 2.7 ms | 10.5 ms |

Task 93 measured the authenticated path the same way, with a throwaway agent on the main-agent profile, launched through `LaunchSessions` in the dev database and deleted afterwards. Each call was signed with the launch token as the relay signs it and walked the agent's real stack:

| What | Calls | Median | Worst |
|---|---|---|---|
| A signed shell command (`PreToolUse`, `git status`) | 50 | 7.0 ms | 17.7 ms |
| A signed prompt (`UserPromptSubmit`) | 50 | 6.6 ms | 11.2 ms |
| A shell command waiting on a stack lock held for 500 ms: time from the release to the answer | 10 | 24.0 ms | 31.7 ms |
| A shell command while the lock is held for 6 s: refused with 503 | 3 | 4010 ms | 4018 ms |

The lock was held by a separate `psql` session (`SELECT ... FOR UPDATE` on the agent's `agent_stacks` row). The time after the release includes the `COMMIT` travelling through `docker compose exec`, so the call itself answers sooner than that. The refusal arrives at the lock wait limit, four fifths of the 5 second deadline, as configured.

In the test suite an uncontended hook call commits in a few tens of milliseconds including setup, and a held lock under a 300 ms deadline times out in about 250 ms (`HookTransactionTest`). The configured limits are a 300 second retry window, a 5 second operation deadline with four fifths of it for the lock wait, 7 days for hook calls and 30 days for closed stacks.

## Driver operations, proven live (plan 26, task 923)

Run on 19 November through a local `journal-agent serve` against the version 6 server, with Core's owner commands
and the cheapest models. The pinned builds are Claude Code 2.1.323 and codex 0.165.0; any other build is refused by
the host before any work starts (`build 2.1.999 of claude is not the pinned build 2.1.323`).

| Operation | Claude Code, process mode (Haiku) | codex, process mode (gpt-6-luna) | Terminal mode, both programs |
| --- | --- | --- | --- |
| Deliver | applied, one real turn per delivery batch | applied | not run live: needs `journal-agent attach` in a real terminal |
| ChangeModel, ChangeEffort | staged, then applied with the next turn | not run live | not run live |
| Wake | an idle runtime with nothing pending settles as no work | not run live | not run live |
| Interrupt | the runtime is held as interrupted until released (`agents:hold-release`) | held as interrupted; the interrupt ends with its turn | not run live |
| Stop | exit proven, runtime stopped, session ended | refused for a runtime whose host restarted (its one-time grant was used): reassignment covers it | not run live |
| Hook calls | reach the journal, through `bin/journal-hook claude-code` | through `bin/journal-hook codex` | not run live |

Rule 36 at launch: Claude Code starts with `--agents {}` and the delegation tools in `--disallowedTools`, and a prompt
asking for the Task tool ran without any child; codex starts with `features.multi_agent` and every related feature
set to false. Not yet shown live: a contradictory control at launch, and the same evidence after a resume and after a
reassignment.

Limits found by the live run: the hook relay boots the whole app, so on a machine without the app's database and
Redis it needs their addresses (task 1229); a host's unavailable report is recorded as failed (task 1230).

## The reply contract (plan 2, task 66)

The adapters share these reply shapes, checked against the vendor documentation on 2026-11-17, not against a running pinned program:

| Journal answer | Pre-tool reply | Stop reply |
|---|---|---|
| Allow (no objection) | `{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}`, plus `additionalContext` when there is context; never a permission decision | `{}` |
| Deny | `permissionDecision: "deny"` with `permissionDecisionReason` | not a stop answer |
| Prevent stop | not a pre-tool answer | `{"decision":"block","reason":"..."}` with one reason, context after it |
| Rewrite | `updatedInput` with every original argument kept, only when the program takes it without a native approval; otherwise a denial pointing to `journal run` | not a stop answer |

The journal never sends `allow`, `ask`, `continue: false` or any other native approval. A journal allow means only that the journal has no objection, so the program's own permission prompt still applies.

## How a call proves who sent it (plan 2, task 57)

Every agent call carries the launch token as a bearer token and three headers the host signs with that token:

- `X-Journal-Call-Id`: the hook call id, the same on every retry of one call.
- `X-Journal-Call-Issued-At`: when the host issued the call, in Unix seconds.
- `X-Journal-Call-Signature`: HMAC-SHA256 of the id, the issue time and the SHA-256 of the body, joined by newlines, keyed with the launch token.

A retry is accepted while the issue time is within the retry window (`hooks.retry_seconds`, 300 by default). The host shim that adds these headers is not built yet.

## When the journal cannot answer (plan 2, task 72)

The host shim, not the journal, answers a hook when the journal is unreachable, because a journal that is down cannot send anything. `OutageReply` holds the replies the host gives, by the offline reply the launch grant sealed and by how the call failed (`CallFailure`):

| How the call failed | Granted the neutral reply | Granted the refusal |
|---|---|---|
| No answer, a timeout, or a gateway's 502 or 504 | the neutral reply; the host logs the bypass and uploads it after recovery | refused with the outage reason |
| 401 or 403 (credential refused) | refused | refused |
| 409 (a changed retry or an expired identity) | refused | refused |
| 422 (a payload the adapter cannot read) | refused | refused |
| 404, 500, 503 or a malformed answer (the journal's own answer) | refused | refused |

A refusal, a changed retry or an unreadable payload is the journal answering, so it never falls back to the neutral reply. After recovery the host uploads the bypass facts; it does not replay missed pre-tool calls as fresh permission. The host relay is `bin/journal-hook <program>`, which runs `php artisan hooks:relay <program>` (`HookRelay`): it signs each call, posts it, answers alone with `OutageReply` when the journal is unreachable, logs the bypass of a launch granted the neutral reply to the file `JOURNAL_BYPASS_LOG`, and uploads the logged bypasses to `POST /hooks/bypasses` before its next call, where Agents keeps them in `launch_bypasses`. The launch must set `JOURNAL_URL`, `JOURNAL_LAUNCH_TOKEN`, the profile pin, `JOURNAL_OFFLINE_REPLY` with its seal `JOURNAL_OFFLINE_REPLY_SEAL`, and `JOURNAL_BYPASS_LOG` in the program's environment; a seal the journal did not issue for this launch stops the relay.

A program that exits or is killed without an end hook is handled by `LaunchHeartbeats`: silence first marks the launch possibly lost (`agents.silent_after_seconds`), and a long silence (`agents.timed_out_after_seconds`) or the host's report of the exit marks it lost, and the stack is closed and kept with its obligations.

## Claude Code

`ClaudeCodeAdapter` (plan 2, task 67) maps the callbacks below. `tests/Fixtures/Hooks/ClaudeCode/hooks.json` holds one captured, redacted payload per callback, and `capabilities.json` the mapping `ClaudeCodeTest` checks.

| Callback | Journal input |
|---|---|
| SessionStart (startup, resume, clear, compact) | onSessionStart, with its source |
| UserPromptSubmit | onPrompt; a denial blocks the prompt with its reason |
| PreToolUse, Bash | onShellCommand, read by the Processes parser |
| PreToolUse, Edit, MultiEdit, Write, NotebookEdit | onFileEdit, with the path; Write counts as a create |
| PreToolUse, Read, Glob, Grep, LS, WebFetch, WebSearch, TodoWrite | not judged: the neutral reply, so Claude Code's own permissions decide |
| PostToolUse | onToolFinished |
| Stop | onStop |
| StopFailure | not judged: its checked `error` code is kept once per callback id and published as `ProgramFailed`; `error_details` is never read; the empty reply |
| SessionEnd | onSessionEnd |
| PreCompact, SubagentStop, Notification, any other callback or tool, `Agent` among them | refused by name (`UnsupportedHook`) |
| onCompaction | not mapped yet: the compaction signal and its correlation are plan 2, task 71 |

| Evidence | State |
|---|---|
| Program and pinned version | Claude Code 2.1.323, captured 2026-11-17 with `claude -p --settings <file> --setting-sources local` |
| Native callbacks and schema | captured: SessionStart (`source` startup, resume or compact; resume adds `seconds_since_last_response` and `context_tokens`, compact adds `model`), UserPromptSubmit (`prompt`, `prompt_id`, `permission_mode`), PreToolUse and PostToolUse (`tool_name`, `tool_input`, `tool_use_id`; PostToolUse adds `tool_response` as an object and `duration_ms`), Stop (`stop_hook_active`, `last_assistant_message`), SessionEnd (`reason` other), PreCompact (`trigger`, `custom_instructions`), SubagentStop. Notification: a headless run raises none, so its fixture keeps the documented shape |
| Agent, launch, vendor session and child identity | the vendor session id is kept on session start. A child starts through the `Agent` tool; its tool calls and its SubagentStop carry `agent_id` and `agent_type` on the parent's `session_id`. Native children are never started (rule 36): the isolated settings deny `Agent`, `Task`, `Workflow`, `SendMessage`, `ListAgents`, `RemoteTrigger` and `Skill` for 2.1.323, and the hook endpoint refuses any call carrying `agent_id` and any of those tools |
| Tool coverage | captured: Bash, Read, Edit, Write and Agent; any other tool, MCP tools included, is refused |
| Legal answers | neutral, deny, prompt block, stop block, context and `updatedInput` without a permission grant, from the documentation: the capture answered every hook with `{}` |
| Native permissions | a neutral reply keeps the user's approval prompt, from the documentation |
| Model-visible channel | `additionalContext` on SessionStart, UserPromptSubmit, PreToolUse and PostToolUse; the reason on a block, from the documentation |
| Exit, timeout and stop cap | not verified: the capture never blocked a stop or ran past a timeout |
| Model selection | `--model <model>`, from `claude --help` of 2.1.323 (2026-11-18); the host starts the program with it |
| Actual model | not reported: no hook payload names the model a turn ran on, so receipts say actual model not reported by this adapter |
| Captured fixtures | `tests/Fixtures/Hooks/ClaudeCode/hooks.json`, captured 2026-11-17, redacted |

## Codex

`CodexAdapter` (plan 2, task 68) maps the callbacks below. `tests/Fixtures/Hooks/Codex/hooks.json` holds one captured, redacted payload per callback, and `capabilities.json` the mapping `CodexTest` checks.

| Callback | Journal input |
|---|---|
| SessionStart | onSessionStart, with its source |
| UserPromptSubmit | onPrompt; a denial blocks the prompt with its reason |
| PreToolUse, Bash | onShellCommand, read from `tool_input.command` |
| PreToolUse, apply_patch | onFileEdit, naming every file the patch in `tool_input.command` adds, updates or deletes |
| PostToolUse | onToolFinished |
| Stop | onStop, noting when the stop already continued once |
| SessionEnd | onSessionEnd |
| PreCompact, any other callback or tool | refused by name (`UnsupportedHook`) |
| onCompaction | not mapped: `codex exec` raised no PreCompact, so none is verified |

| Evidence | State |
|---|---|
| Program and pinned version | codex-cli 0.165.0, captured 2026-11-17 with `codex exec` under an isolated `CODEX_HOME` |
| Native callbacks and schema | captured: SessionStart (`source` startup, `model`, `permission_mode`), UserPromptSubmit (`turn_id`, `prompt`), PreToolUse and PostToolUse (`tool_name`, `tool_input`, `tool_use_id`; PostToolUse adds `tool_response` as the tool's text, which starts with `Exit code: N` for apply_patch), Stop (`stop_hook_active`, `last_assistant_message`), SessionEnd (`reason` other). PreCompact: `codex exec` raises none, so its fixture keeps the documented shape |
| Settings file shape | `hooks.json` in `CODEX_HOME`, shaped as Claude Code's: each event holds `[{"matcher": "*", "hooks": [{"type": "command", "command": "..."}]}]`, with no matcher on UserPromptSubmit and Stop. Codex runs a hook only when `config.toml` holds `[hooks.state."<hooks.json path>:<event_key>:<group>:<index>"]` with `enabled = true` and `trusted_hash`, the sha256 of the hook's normalized definition, and the work folder has `trust_level = "trusted"`; an untrusted hook is skipped without a word |
| Agent, launch, vendor session and child identity | the vendor session id is kept on session start. Native children are never started (rule 36): with every agent feature off, 0.165.0 still offers `collaboration.spawn_agent`, `wait_agent`, `send_message`, `followup_task`, `interrupt_agent` and `list_agents` (plan 26 task 888), so the hook endpoint refuses every call to them, as version 5 does |
| Tool coverage | captured: Bash and apply_patch; any other tool is refused |
| Legal answers | neutral, deny and stop block from the documentation; `updatedInput` only with `permissionDecision: allow`, so the journal refuses rewrites |
| Native permissions | a neutral reply omits `permissionDecision`, from the documentation |
| Model-visible channel | not verified |
| Exit, timeout and stop cap | not verified: the capture never blocked a stop or ran past a timeout; SessionEnd hooks run for 1 second unless they say more, 3 at most |
| Model selection | `-m, --model <MODEL>`, from `codex --help` of 0.165.0 (2026-11-18); the host starts the program with `--model` |
| Actual model | not reported: SessionStart carries the `model` the session started with, but no turn reports the model it ran on, so receipts say actual model not reported by this adapter |
| Captured fixtures | `tests/Fixtures/Hooks/Codex/hooks.json`, captured 2026-11-17, redacted |

## Container capabilities

Doc 14 (sections 55 to 57 and 60) asks five things of each pinned program before a helper runs it in a required container. `docs/accounts/container-capabilities.json` holds one row per capability and program, read through `HostCapabilities`; a launch whose configured guarantee needs a capability that is not `supported` is refused before work with `capability-unsupported` (`HostCapabilityUnsupported`), and the account transport with `account-container-unsupported`.

A capability is marked supported only from a native run inside the admitted container, never from documentation. No such run exists yet: the protected host that starts containers is task 258 (plan 8), and the hook capture of task 89 ran the programs headless on the host. Every row is therefore unverified, with what is known:

| Capability | What must hold | Claude Code 2.1.323 | Codex 0.165.0 |
|---|---|---|---|
| callback-separation | native hook callbacks travel on a channel apart from MCP requests, and model tools cannot forge them | unverified: hooks are command children of the program and MCP has its own servers, but no container run has tried to forge a callback from a tool | unverified: the same shape, not tried |
| relay-protection | relay channel material is unreadable by model-run descendants | unverified: hook commands run as the same user as the Bash tool; a separate user or the program's sandbox has not been checked | unverified: hook commands run as the same user as the shell tool; Codex's sandbox has not been checked |
| process-tracking | the host tracks every model-run descendant, background shells included, as one process group | unverified: no container run | unverified: no container run |
| completion-fence | the host closes new action admission through completion and bumps the workspace generation before a changing tool | unverified: no host yet (task 258) | unverified: no host yet (task 258) |
| stop-deadline | the Stop hook's deadline, `stop_hook_active` and the continuation cap | unverified: `stop_hook_active` is captured on Stop; the capture never blocked a stop or passed a timeout | unverified: `stop_hook_active` is captured on Stop; SessionEnd hooks run for 1 second unless they say more, 3 at most; the Stop deadline and cap are not measured |

A row turns supported only with the commands, the redacted output and the program build of a container run recorded here.

## Account launch compatibility

Each adapter answers `compatibility()` with a `ProgramCompatibility` (`app/Hooks/Support/ProgramCompatibility.php`):
the pinned version and binary digest of its account-free capture, the flags and account settings checked against that
build, and how launches on one account share its sign-in. Launch preparation reads it and calls `requireLaunchable()`,
which refuses with `ProgramArrangementUnproven` unless the real program showed the arrangement. Failure notifications
are a separate path (`NotificationCall`, `ProgramFailed`) and never change this record.

Every claim carries one of three states: contract passed (the journal's own tests pass), native shown (a run of the
pinned program showed it) or prerequisite missing (what showing it needs is not there yet). Settings text alone is
never native evidence.

| Program | Arrangement | State | Who shows the rest |
|---|---|---|---|
| Claude Code 2.1.323 | direct processes: each launch runs its own process on the account directory | prerequisite missing: parallel refresh, Keychain separation and hooks under `--restricted` need a signed-in run | the signed-in procedure of `docs/accounts/claude-integration.md` |
| Codex 0.165.0 | shared owner: one `codex app-server` owns sign-in and refresh, each launch a thread on it, with `cli_auth_credentials_store = "file"` | prerequisite missing: hooks on threads, separate thread identities and refresh under parallel threads need a signed-in run | the signed-in procedure of `docs/accounts/codex-integration.md` |

The Accounts pages stay available while a state is missing; only account launches are refused.
