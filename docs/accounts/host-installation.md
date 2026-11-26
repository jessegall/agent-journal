# Installing and running the protected host

The protected host is `journal-agent` on the machine where agents run. It starts the pinned Claude Code and Codex
builds on saved accounts, keeps each account's sign-in on the host, and refuses any start it cannot run protected.

There are two arrangements. In the local one (a Mac, or a Linux machine without containers) the host is
`journal-agent` installed into a sealed folder as below, and every program runs on the machine itself. In the
contained one (a server, `AGENTS_ARRANGEMENT=contained`) the host is the `agent-host` compose service, and every
agent runs in a container of the agent daemon; the steps for that are in
[contained-installation.md](contained-installation.md), and the differences are listed under "The contained host"
below.

## Install

1. Write a manifest of every artifact: each one's installed name, its source file and its SHA-256, and whether it is
   executable. It holds `bin/claude` (2.1.323), `bin/codex` (0.165.0), `bin/journal-agent`, `bin/php` and the
   journal's PHP application with its dependencies under `journal/` (the hook relay and
   `journal/tools/accounts/prepare-codex.php`).
2. `journal-agent install --manifest <file> --into <absolute folder>` copies every artifact into a staging folder,
   checks each digest, seals the copy read-only and publishes it with one rename. A digest that differs installs
   nothing; an existing folder is never replaced. Install into a folder no other user can write into, outside every
   repository and work folder.
3. `journal-agent installation --folder <folder>` prints each verified artifact. A changed or writable installation
   is refused.

## Enroll and serve

1. `journal-agent enroll --journal <url> --host <id>` with the host secret on standard input saves the enrollment in
   the owner-only state folder.
2. `journal-agent serve --installation <folder> --hook-command "<installed relay>"` verifies the installation, sends
   the start reports queued before a restart, reconciles the starts the journal counts as possibly running and carries
   out the orders it claims from the journal.
3. `journal-agent attach --installation <folder> --agent <id> --folder <work folder> --program claude` opens an
   agent's main Claude Code runtime on a terminal. Codex has no terminal to attach to: its runtimes are threads on
   the account's shared app-server.

## How a start runs

Every start, whether a claimed request or a local start, goes the same way, each stage saved in the state folder
before the next step (`starts/<runtime>.json`):

1. The runtime's one-use grant is saved; then the account claim is sent and its answer saved. A claim whose answer
   was lost is never sent again: reconciliation settles it.
2. The start is refused unless the installation verifies, the claim's recipe is for the runtime's build and
   the journal's protection report of the host reports the program's arrangement available on this host.
3. The output grants the journal sealed for the start are saved; without them the start does not run.
4. The program starts from the installation with a clean environment: the host's platform variables, an empty home,
   the installation's PATH and the account recipe's settings. No inherited key, token or endpoint reaches it.
5. Claude Code checks its sign-in first (`auth status`: claude.ai, in the account's own folder) and a turn whose
   result is an error fails, even when the process exits cleanly. Codex runs one app-server per account sign-in
   generation, refused unless it reports a ChatGPT sign-in; each runtime is one thread with its own turns.

A stop counts as proven only when no process of the start's group is left, tool children included. A restart
reports stopped only the starts whose process is proven gone and starts nothing again; anything it cannot prove is
left needing attention.

Before the sign-in runner replaces or removes an account's sign-in, it asks the host over the start socket to end
the account's Codex owner and every execution on it; an account the host cannot drain is left unchanged.

## Why a start is refused

| Refusal | What it means | What to do |
|---|---|---|
| no protected installation | serve or attach ran without `--installation` | install, then pass the folder |
| the installation changed | an artifact's digest, mode or place differs | install anew into a new folder |
| the protected arrangement is not available | the journal's protection report of the host names a missing mechanism or missing native evidence | run the native evidence procedures; a missing mechanism stays until the pinned client has one |
| the account claim may have been taken | a claim's answer was lost | the host's reconciliation settles it; nothing to retry |
| not assigned to this host | the runtime belongs to another host | none: another host's account start is never claimed |
| no saved-account transport into a container | a required-container start on an account in the local arrangement, or a Codex start in the contained one | unsupported there; in the contained arrangement a Claude Code account's own sign-in folder is mounted into its own session's container |

## The contained host

- The `agent-host` service runs `journal-agent serve --arrangement=contained` from the runner image, as uid 10001,
  with its private state on the `host-state` volume. It publishes no port and never sees the server's Docker socket.
- `agent-host-enroll` enrolls it once from the compose secret `journal_host_secret` (a file, never the environment)
  and does nothing when `host-state` already holds the same enrollment.
- The sign-in runner has its account folders made and removed through `make_folder` and `remove_folder` orders the
  journal places for the host.
- In place of the sealed installation folder, the two images are pinned by id (`AGENT_IMAGE`, `RUNNER_IMAGE`); the
  host checks both on the agent daemon before it serves, and the agent daemon holds no other image.
- A Claude Code session's container gets its account's own sign-in folder, read-write, at `/home/journal/.account`,
  and no other account. That admits Claude Code running signed in inside its container; it does not keep the
  container's tools away from that folder, which waits on the provider transport (task 1357). Codex starts are refused
  in this arrangement.

## The native evidence

`php tools/accounts/check-claude.php` and `check-codex.php`, run on the host against journal accounts with
`--host=<installed journal-agent> --host-state=<state folder>`, print one item per check, each pass, missing or
fail, with the task that consumes it. An item stays missing until its procedure has run on this host for the pinned
build; Codex's sandbox limits writes only, so its read items have no mechanism
([host-protection.md](host-protection.md)). Tasks 243 and 265 consume these results; nothing is promoted until they
pass.
