# Program capabilities

This is the one place where the journal records what it knows about each agent program's hooks. A `ProgramCapabilities` value in the code records the contract an adapter was written against; this file records the evidence behind it. A program version is supported only when every row of its matrix below is filled from a captured, redacted fixture of that version.

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

| Evidence | State |
|---|---|
| Program and pinned version | not verified |
| Native callbacks and schema | documented PreToolUse and Stop shapes only |
| Agent, launch, vendor session and child identity | not verified |
| Tool coverage | not verified |
| Legal answers | neutral, deny and stop block from the documentation; `updatedInput` only with `permissionDecision: allow`, so the journal refuses rewrites |
| Native permissions | a neutral reply omits `permissionDecision`, from the documentation |
| Model-visible channel | not verified |
| Exit, timeout and stop cap | not verified |
| Captured fixtures | none yet |
