# Host protection of saved accounts

A saved account's sign-in lives on the host. The program that signs in must read it; the tools the model runs must
not. A protected arrangement keeps every tool subprocess, whatever command or file tool it uses, away from six items:

| Item | What the tools must not reach |
|---|---|
| account-secrets | the account's sign-in files and settings |
| foreign-history | another session's history on the same account |
| keychain | the system's secret store (macOS Keychain, the Linux secret service) |
| control-sockets | the host's attach socket and any other private Unix socket |
| process-inspection | the other processes of the same user |
| install-writes | the protected installation and the accounts folder |

Command-text checks and folder modes do not count: a tool runs as the same user and can reach anything that user can.
Only what the pinned client applies natively before its tools run counts, and only once a private native procedure
has shown it hold on this host.

## How the journal judges a contained host

The journal judges each contained host itself (`App\Agents\Drivers\Isolation`): for every driver family on the
standard and the protected container it keeps a report of each item with the native mechanism the pinned client has
for it or why it has none, the recorded run that showed it hold, and whether the whole arrangement is enforced. An item
with a mechanism but no recorded run is reported as missing native evidence; an item with no mechanism stays
unavailable whatever is recorded. A run is per driver, build and platform.

The operator records a run of the native procedures with
`php artisan accounts:record-protection-run <host> <family> <platform> <run> <items...>`, which judges that report
again.

## The protected-account trial

Evidence for the protected container can only be made by running a protected session, so a driver named in
`AGENTS_PROTECTED_ACCOUNT_TRIAL` (a family such as `claude-code`, which covers `claude-code-headless`) starts its
protected container once every item has its native mechanism, before any run is recorded. The journal reads the
setting itself and the contained host gets it as `--protected-trial`. A driver that is not named, and any item with no
mechanism, stays refused, and the refusal names each item with its reason.

## No driver sandbox

The journal never uses Claude Code's or Codex's own sandbox (Seatbelt, bubblewrap, Landlock), and never changes their
defaults to turn one on: a start gets only the one setting that skips every question (Claude Code's
`bypassPermissions`, Codex's `--dangerously-bypass-approvals-and-sandbox`), and the flags a user adds to
`journal claude` or `journal codex` pass through as they are. The container is the journal's only boundary.

So on a host, a connected local project included, no item is enforced: the program and the commands it runs share
one user. In the standard agent container the same holds, except that each Claude Code session has its own history
volume over the account's projects folder. Only the protected container keeps every item, by its two users:

| Item | What meets it in the protected container |
|---|---|
| account-secrets | the driver runs as uid 10001 with the account folder; every command the model runs goes through the executor as uid 10002, which cannot read it; the file tools obey the managed deny rules |
| foreign-history | each session's own history volume (Claude Code); the threads under CODEX_HOME belong to uid 10001 (Codex) |
| keychain | the agent image runs no session D-Bus or secret service, and uid 10002 reaches nothing of uid 10001 |
| control-sockets | the executor socket admits only uid 10001 |
| process-inspection | the driver runs as another uid, so `/proc` of uid 10001 is refused to uid 10002 |
| install-writes | uid 10002 writes only the workspace and `/tmp`; `/opt` and `/etc` are root-owned |

The agent containers run under Docker's default seccomp and AppArmor rules (`.docker/helper/seccomp-agent.json`,
`.docker/helper/apparmor-agent`), with every capability dropped and no-new-privileges: nothing in them needs to make
namespaces or mounts.
