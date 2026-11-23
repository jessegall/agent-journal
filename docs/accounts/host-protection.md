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

A contained host asks about the agent image, where its tools run: `journal-agent protection --program claude --build
2.1.323 --arrangement=contained --docker=<agent daemon socket> --installation-name=<name> --agent-image=<image id>
--seccomp-profile=/etc/journal/security/seccomp-agent.json` reports platform `linux-container`. It runs socat and
bubblewrap with Claude Code's sandbox flags in throwaway containers of the agent image, as the agent's user, with no
network and no account, and never looks at the host's own PATH. Its evidence is kept under
`linux-container@<agent image id>`, so a new image needs new evidence.

## The protected-account trial

Evidence for the protected container can only be made by running a protected session, so a driver named in
`AGENTS_PROTECTED_ACCOUNT_TRIAL` (a family such as `claude-code`, which covers `claude-code-headless`) starts its
protected container once every item has its native mechanism, before any run is recorded. The journal reads the
setting itself and the contained host gets it as `--protected-trial`. A driver that is not named, and any item with no
mechanism, stays refused, and the refusal names each item with its reason.

## What the pinned clients have today

On macOS, Claude Code 2.1.323's sandbox (`sandbox.enabled`, a Seatbelt profile for Bash and its children) and its
permission rules give a mechanism for account secrets, the Keychain, private sockets and protected writes. The host
adds the rest: it starts each session's program under a Seatbelt profile of its own (`sandbox-exec`,
`tools/journal-agent/host/session_sandbox.go`), so the program and every tool it starts read and write only their
own workspace's history in the account folder and see and signal no process outside the session. On Linux outside a
container the same Claude Code sandbox runs in bubblewrap and needs `bwrap` and `socat` on the host; it adds a PID
namespace, and nothing tells one session's history from another's.

Codex 0.165.0's `workspace-write` sandbox (Seatbelt on macOS, Landlock on Linux) limits writes only: a command can
read `auth.json` and other threads' sessions. Only protected writes have a mechanism.

So Claude Code on macOS has a mechanism for every item, and its arrangement is available once native evidence for
this build shows each one hold; Codex lacks one for reads on every platform. The journal refuses an arrangement
(`ProgramCompatibility`) until the host reports it available.

## In a container

On a server the agent runs in the agent image on the agent daemon, with every capability dropped and
no-new-privileges. Claude Code's bubblewrap sandbox needs a user namespace, its own mounts, `pivot_root` and a fresh
`/proc`. On the test server (Ubuntu 26.04, kernel 7.0.0-42, Docker 29.7, AppArmor on and
`kernel.apparmor_restrict_unprivileged_userns=1`) three things stand in its way:

| Denial | Cause | Narrow fix |
|---|---|---|
| `No permissions to create new namespace` | Docker's default seccomp profile allows `unshare`, `mount`, `umount2`, `setns` and namespace flags on `clone` only with `CAP_SYS_ADMIN`, and has no rule for `pivot_root` | `.docker/helper/seccomp-agent.json`: Docker's default profile (moby/profiles `seccomp/default.json`) with one added rule allowing `clone`, `unshare`, `mount`, `umount2`, `pivot_root` and `setns`; with no capability they act only inside the new user namespace |
| `setting up uid map: Permission denied`, `loopback: Failed RTM_NEWADDR` | Ubuntu gives an unconfined process that makes a user namespace no capabilities in it, and Docker's default AppArmor profile denies mounts | `.docker/helper/apparmor-agent`: Docker's default rules with `userns`, `mount`, `umount` and `pivot_root` allowed |
| `Can't mount proc on /newroot/proc: Operation not permitted` | The kernel mounts a new `/proc` inside a user namespace only where a `/proc` is fully visible, and Docker masks and makes read-only parts of the container's `/proc` (`/proc/kcore`, `/proc/keys`, `/proc/sys` and others) | none: only `systempaths=unconfined` lifts the masks, and that is not accepted |

Under the pair and with the masks lifted (a diagnosis only), bwrap with Claude Code's flags starts and its `/proc`
shows only its own four processes. With the masks in place it stops at the `/proc` mount. Claude Code's weaker nested
mode (`enableWeakerNestedSandbox`) binds the container's `/proc` instead, so a tool sees every process of the
container, Claude Code's own among them, and can read its environment; it is not accepted either.

So process inspection has no native mechanism for Claude Code in a container, and the journal keeps it refused there
until the provider transport (task 1357) moves the sign-in out of the agent container. The pair stays in the repository:
it is what the agent container runs under, and it is all bubblewrap needs once a `/proc` can be mounted.

The probes ran on the server's own Docker daemon, which applies both profiles. The agent daemon, a rootful Docker under
Sysbox, applies the seccomp profile, which the agent host's Docker client sends with each container; whether it
applies the AppArmor profile inside Sysbox has not been checked. The `/proc` masks are the same on every daemon.

Per item, in the agent container (platform `linux-container`, evidence per agent image):

| Item | What meets it in the container |
|---|---|
| account-secrets | only the session's own account folder is mounted, at `/home/journal/.account`; keeping the tools away from it needs Claude Code's sandbox, which does not start, so it is unavailable until the provider transport |
| foreign-history | each session's own history volume over the account's projects folder |
| keychain | Claude Code's sandbox, so unavailable while it does not start |
| control-sockets | Claude Code's sandbox, so unavailable while it does not start; the host's sockets are never mounted |
| process-inspection | none: the `/proc` masks stop bubblewrap's PID namespace |
| install-writes | Claude Code's sandbox, so unavailable while it does not start; the images are pinned by digest and the container holds no installation folder |

While bubblewrap does not start, `journal-agent protection --arrangement=contained` reports every item unavailable
with that one reason (`tools/journal-agent/host/sandbox_mechanisms.go`); the container's own limits (dropped
capabilities, no-new-privileges, the budgets, the one account mount) hold regardless.
