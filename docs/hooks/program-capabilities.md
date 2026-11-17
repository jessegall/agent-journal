# Program capabilities

This is the one place where the journal records what it knows about each agent program's hooks. A `ProgramCapabilities` value in the code records the contract an adapter was written against; this file records the evidence behind it. A program version is supported only when every row of its matrix below is filled from a captured, redacted fixture of that version.

## What plan 2 delivered, and what it did not

The core is built and tested on PostgreSQL: typed hook inputs, the top-first walk with recorded steps, the role bottom states, the state types and restoration, the rewrite recheck, the two Hooks tables with versioned casts, the per-request agent scope, the bounded stack transaction with replay, the domain states pushed by their own listeners, the authoritative shell parser, the Claude Code and Codex adapters, the authenticated endpoint `POST /hooks/{program}`, launches with isolated settings and separate child stacks, compaction once with reminders, loss confirmation, the outage replies, the read-only inspector `GET /hooks/stacks/{agentId}/{sessionId}` and retention.

No production program runs under it yet. No pinned Claude Code or Codex version has been verified, the host relay exists but has not run under a real program, and the fixtures are written from documented shapes. Until task 89 is done, the program support below is a written contract, not a verified capability. The owner work still missing is listed in `docs/hooks/dependencies.md`.

## Measured limits

Measured on 2026-11-17 against the running FrankenPHP Octane app in Docker, from the host, 50 calls each:

| What | Median | Worst |
|---|---|---|
| The health check `/up` | 1.7 ms | 6.7 ms |
| A hook call with an unknown token, refused at the credential lookup | 2.7 ms | 10.5 ms |

Not measured on the live app: an authenticated hook call end to end and a stack lock wait (task 93). In the test suite an uncontended hook call commits in a few tens of milliseconds including setup, and a held lock under a 300 ms deadline times out in about 250 ms (`HookTransactionTest`). The configured limits are a 300 second retry window, a 5 second operation deadline with four fifths of it for the lock wait, 7 days for hook calls and 30 days for closed stacks.

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

The host shim, not the journal, answers a hook when the journal is unreachable, because a journal that is down cannot send anything. `OutageReply` holds the replies the host gives, by role and by how the call failed (`CallFailure`):

| How the call failed | Main agent | Read-only helper |
|---|---|---|
| No answer, a timeout, a server error or 503 | the neutral reply; the host logs the bypass and uploads it after recovery | refused with the outage reason |
| 401 or 403 (credential refused) | refused | refused |
| 409 (a changed retry or an expired identity) | refused | refused |
| 422 (a payload the adapter cannot read) | refused | refused |

A refusal, a changed retry or an unreadable payload is the journal answering, so it never falls back to the neutral reply. After recovery the host uploads the bypass facts; it does not replay missed pre-tool calls as fresh permission. The host relay is `bin/journal-hook <program>`, which runs `php artisan hooks:relay <program>` (`HookRelay`): it signs each call, posts it, answers alone with `OutageReply` when the journal is unreachable, logs a main agent's bypass to the file `JOURNAL_BYPASS_LOG`, and uploads the logged bypasses to `POST /hooks/bypasses` before its next call, where Agents keeps them in `launch_bypasses`. The launch must set `JOURNAL_URL`, `JOURNAL_LAUNCH_TOKEN`, `JOURNAL_ROLE` and `JOURNAL_BYPASS_LOG` in the program's environment.

A program that exits or is killed without an end hook is handled by `ConfirmLaunchLoss`: silence first makes the loss suspected (`agents.suspect_loss_after_seconds`), a long silence (`agents.confirm_loss_after_seconds`) or the host's report of the exit confirms it, and the stack is closed and kept with its obligations.

## Claude Code

`ClaudeCodeAdapter` (plan 2, task 67) maps the callbacks below. `tests/Fixtures/Hooks/ClaudeCode/hooks.json` holds one redacted payload per callback, written from the documented shapes, and `capabilities.json` the mapping `ClaudeCodeTest` checks.

| Callback | Journal input |
|---|---|
| SessionStart (startup, resume, clear, compact) | onSessionStart, with its source |
| UserPromptSubmit | onPrompt; a denial blocks the prompt with its reason |
| PreToolUse, Bash | onShellCommand, read by the Processes parser |
| PreToolUse, Edit, MultiEdit, Write, NotebookEdit | onFileEdit, with the path; Write counts as a create |
| PreToolUse, Read, Glob, Grep, LS, WebFetch, WebSearch, TodoWrite | not judged: the neutral reply, so Claude Code's own permissions decide |
| PostToolUse | onToolFinished |
| Stop | onStop |
| SessionEnd | onSessionEnd |
| PreCompact, SubagentStop, Notification, any other callback or tool | refused by name (`UnsupportedHook`) |
| onCompaction | not mapped yet: the compaction signal and its correlation are plan 2, task 71 |

| Evidence | State |
|---|---|
| Program and pinned version | not verified |
| Native callbacks and schema | the callbacks above, from the documentation |
| Agent, launch, vendor session and child identity | the vendor session id is kept on session start; child identity is plan 2, task 70 |
| Tool coverage | the tools above; any other tool, including MCP tools, is refused |
| Legal answers | neutral, deny, prompt block, stop block, context and `updatedInput` without a permission grant |
| Native permissions | a neutral reply keeps the user's approval prompt, from the documentation |
| Model-visible channel | `additionalContext` on SessionStart, UserPromptSubmit, PreToolUse and PostToolUse; the reason on a block |
| Exit, timeout and stop cap | not verified |
| Captured fixtures | documented shapes only; none captured from a pinned version yet |

## Codex

`CodexAdapter` (plan 2, task 68) maps the callbacks below. `tests/Fixtures/Hooks/Codex/hooks.json` holds one redacted payload per callback, written from the documented shapes, and `capabilities.json` the mapping `CodexTest` checks.

| Callback | Journal input |
|---|---|
| SessionStart | onSessionStart, with its source |
| UserPromptSubmit | onPrompt; a denial blocks the prompt with its reason |
| PreToolUse, shell or exec_command | onShellCommand; a command given as `bash -lc <line>` is read as its line |
| PreToolUse, apply_patch | onFileEdit, naming every file the patch adds, updates or deletes |
| PostToolUse | onToolFinished |
| Stop | onStop, noting when the stop already continued once |
| SessionEnd, PreCompact, any other callback or tool | refused by name (`UnsupportedHook`) |
| onCompaction, onSessionEnd | not mapped: no verified Codex callback yet |

| Evidence | State |
|---|---|
| Program and pinned version | not verified |
| Native callbacks and schema | the callbacks above, from the documentation |
| Agent, launch, vendor session and child identity | the vendor session id is kept on session start; child identity is plan 2, task 70 |
| Tool coverage | shell, exec_command and apply_patch; any other tool is refused |
| Legal answers | neutral, deny and stop block from the documentation; `updatedInput` only with `permissionDecision: allow`, so the journal refuses rewrites |
| Native permissions | a neutral reply omits `permissionDecision`, from the documentation |
| Model-visible channel | not verified |
| Exit, timeout and stop cap | not verified |
| Captured fixtures | none yet |
