# Codex native evidence: the private procedure

`programs/accounts/check-codex.php` checks, on the protected host, what the account-free capture
([codex-integration.md](codex-integration.md)) could not, for Codex 0.165.0 under its chosen arrangement: one
`codex app-server` per account owns the sign-in and refresh, each launch a thread on it, the working root an empty
trusted journal folder. It is the source of every Codex item doc 17 marks native shown; until it passes an item, that
item stays prerequisite missing and the journal refuses what depends on it. A missing real subscription is a missing
prerequisite, never proof that a capability is unsupported.

## What it may touch

- Only account directories inside the journal's accounts folder (`--accounts-root`, or `JOURNAL_ACCOUNTS_ROOT`); a
  personal `~/.codex` login is never read.
- Accounts are signed in by a user through the journal's own sign-in on the host. The procedure never starts a
  sign-in and never opens `auth.json`: it only checks that the file exists beside the file-store setting.
- Every run gets only `PATH`, an empty `HOME` and the account's `CODEX_HOME`. Of `login status` only the exit is
  kept; no login or exec output is printed. The configuration items run on empty, throw-away `CODEX_HOME` folders.

## Running it

```
php programs/accounts/check-codex.php --accounts-root=<journal accounts folder> \
    --account-a=<account directory> --account-b=<account directory>
```

It prints one JSON object: the program, the installed version and binary digest, the arrangement (`shared-owner`,
from `ProgramCompatibility::pinned`) and one result per item, each `pass`, `missing` or `fail` with its reason and
the task that consumes it.

## The items

| Item | Shows | Consumer |
|---|---|---|
| pinned-build | the installed binary is 0.165.0 with the pinned digest | task 252 |
| launch-flags | the help names `app-server` and `--add-dir` | task 240 |
| empty-account-signed-out | an empty `CODEX_HOME` has no credential | task 240 |
| trusted-work-folder-loads-its-config | trusting a work folder loads its own `.codex/config.toml`, so the next item is meaningful | task 242 |
| empty-root-excludes-work-folder-config | a trusted empty working root loads nothing from the work folder | task 242 |
| account-a-signed-in, account-b-signed-in | each journal account is signed in | task 254 |
| account-a-file-store, account-b-file-store | each keeps its sign-in in its own `auth.json` with `cli_auth_credentials_store = "file"` | task 230 |
| sign-in-survives-restart | a new process finds A signed in | task 247 |
| accounts-separate | missing: an `account/read` identity check through the shared owner | task 254 |
| hooks-run-in-empty-root | missing: a signed-in thread with the journal hooks and the work folder as `--add-dir` | task 242 |
| thread-identities-and-cancellation | missing: two threads on one owner keep their own ids, and interrupting one leaves the other | task 243 |
| parallel-refresh | missing: two threads on one owner across a token refresh | task 243 |
| cleanup | missing: removing a disposable account, then a folder check | task 246 |
| outage-keeps-denials | missing: a protected launch while the journal is unreachable | task 263 |
| host-* | missing: the protected host's native boundary for each item, as the journal's protection report of the host reports it ([host-protection.md](host-protection.md)) | task 258 |

A thread's id, recorded when `thread/started` arrives, is the execution key; a session tree's or a fork's id never
is. `tests/Unit/Accounts/CodexNativeEvidenceTest.php` runs the procedure against a mock program.
