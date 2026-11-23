# Claude Code native evidence: the private procedure

`tools/accounts/check-claude.php` checks, on the protected host, what the account-free capture
([claude-integration.md](claude-integration.md)) could not: what Claude Code 2.1.323 does with real accounts. It is
the source of every Claude item that doc 17 marks native shown; until it passes an item, that item stays prerequisite
missing and the journal refuses what depends on it.

## What it may touch

- Only account directories inside the journal's accounts folder (`--accounts-root`, or `JOURNAL_ACCOUNTS_ROOT`). A
  directory outside it is refused before anything runs, so a personal `~/.claude` login is never read.
- Accounts are signed in by a user through the journal's own sign-in on the host; the approval stays in the
  browser. The procedure never starts a sign-in, never sees a challenge and never reads a credential file.
- Every run gets only `PATH`, an empty `HOME`, the account directory as `CLAUDE_CONFIG_DIR` and an empty
  `ANTHROPIC_CONFIG_DIR`. Standard error is dropped unread; of `auth status` only whether it is signed in and a
  sha256 of its identity are kept.
- Only `--allow-requests` lets it send a request: one short prompt on account A for the hostile work settings item.

## Running it

```
php tools/accounts/check-claude.php --accounts-root=<journal accounts folder> \
    --account-a=<account directory> --account-b=<account directory> [--allow-requests]
```

It prints one JSON object: the program, the installed version and binary digest, the arrangement
(`direct-processes`, from `ProgramCompatibility::pinned`) and one result per item, each `pass`, `missing` or
`fail` with its reason and the task that consumes it. Without accounts it still runs, and every signed-in item is
missing with what it needs.

## The items

| Item | Shows | Consumer |
|---|---|---|
| pinned-build | the installed binary is 2.1.323 with the pinned digest | task 252 |
| launch-flags | the help of the installed build names every launch flag | task 240 |
| empty-account-signed-out | an empty account directory has no credential | task 240 |
| account-a-signed-in, account-b-signed-in | each journal account is signed in | task 253 |
| accounts-separate | A and B report different identities | task 231 |
| sign-in-survives-restart | a new process finds A signed in as before | task 247 |
| hostile-work-settings-ignored | a work-folder `.claude/settings.json` hook does not run under `--restricted` | task 262 |
| keychain-cleanup | missing: removing a disposable account, then a Keychain check | task 246 |
| parallel-refresh | missing: two launches on one account across a token refresh | task 243 |
| own-output-and-foreign-denial | missing: the protected launcher with per-session output rules | task 262 |
| outage-keeps-denials | missing: a protected launch while the journal is unreachable | task 263 |
| host-* | missing: the protected host's native boundary for each item, as journal-agent protection reports it ([host-protection.md](host-protection.md)) | task 258 |

Help text and flags are never authentication proof: `launch-flags` only shows the build accepts them.
`tests/Unit/Accounts/ClaudeNativeEvidenceTest.php` runs the procedure against a stand-in program.
