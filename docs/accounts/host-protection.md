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

## Asking the host

`journal-agent protection --program claude --build 2.1.323` prints, for this host's platform, each item with the
native mechanism the pinned client has for it or why it has none, the evidence run that showed it hold, and whether
the whole arrangement is available. An item with a mechanism but no recorded evidence is reported as missing native
evidence; an item with no mechanism stays unavailable whatever evidence says. Evidence is per program, build and
platform: a record for another build or another platform does not count.

The evidence file is `native-evidence.json` in the host's private state folder, readable by the host's owner alone;
the native evidence procedures write it (doc 57 step 28).

## What the pinned clients have today

On macOS, Claude Code 2.1.323's sandbox (`sandbox.enabled`, a Seatbelt profile for Bash and its children) and its
permission rules give a mechanism for account secrets, the Keychain, private sockets and protected writes. It has
none for another session's history, which shares one projects folder, or for process inspection. On Linux the same
sandbox runs in bubblewrap and needs `bwrap` and `socat` on the host; it adds a PID namespace.

Codex 0.165.0's `workspace-write` sandbox (Seatbelt on macOS, Landlock on Linux) limits writes only: a command can
read `auth.json` and other threads' sessions. Only protected writes have a mechanism.

So neither program's protected arrangement is available yet: Claude Code lacks a native boundary for foreign history
and process inspection, Codex for reads. The journal keeps both arrangements refused (`ProgramCompatibility`) until a
host reports one available.
