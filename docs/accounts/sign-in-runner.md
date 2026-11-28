# The sign-in runner

A program's sign-in writes the account's credentials, so it never runs in the app's own containers. The runner,
`php artisan accounts:run-sign-ins` (`RunSignInsCommand`), runs in one of two places:

- **On the Mac (the local arrangement):** `bin/journal-account` starts it as the journal's own host user, with
  `JOURNAL_URL` and the enrolled host's `JOURNAL_HOST_SECRET` in its environment.
- **On a server (the contained arrangement):** the always-on `accounts` compose service runs it from the runner image
  as uid 10001, with `JOURNAL_URL=http://app:8000`, the host secret in the owner-only file `JOURNAL_HOST_SECRET_FILE`
  names and `ACCOUNTS_ROOT=/accounts` on the volume `accounts-data`; its account folders are made and removed by the
  agent host, through folder orders the journal places for it.

A server the user runs for themselves counts as user-operated, like the Mac, so every method below is offered on both.

## How it talks to the journal

It uses the enrolled host's signed transport (the bearer secret plus a signature over each call), never an agent's
launch token. Each claim names the runner's arrangement, and the journal refuses a runner of the other arrangement
(`SignInRunnerRefused`); the runner reports such a refusal once and keeps asking.

| Route | Command | What it does |
|---|---|---|
| `POST /host/sign-ins/claim` (`arrangement`) | `ClaimSignIn` | hands the runner the oldest sign-in nobody runs, or 204; an attempt is run by one host only |
| `POST /host/sign-ins/{attempt}/report` (`outcome`, `generation`, `identity`, `refusal`) | `ReportSignIn` | `waiting`, `verified` (saved once, only while live, within its deadline and in its generation) or `failed`, with the provider's short refusal when it gave one |

The runner also claims checks of saved accounts and cleanups of folders that are no longer used, one at a time.

## The methods

Each program declares the methods it has; the form offers only those (`SignInProtocols`, registered in
`ProfilesServiceProvider`).

| Program | Method | How the owner gives it | What the runner does |
|---|---|---|---|
| Claude Code | OAuth (`ClaudeSignIn`) | opens Claude's page, signs in, pastes back the code it shows | runs `claude` sign-in on a fresh staging folder, hands it the pasted code on its standard input, then checks the status |
| Claude Code | Provider token (`ClaudeTokenSignIn`) | pastes a token made with `claude setup-token` | writes it to a secret file in the staging folder and gives it to `claude` on its own file descriptor (`CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR`) |
| Claude Code | API key (`ClaudeKeySignIn`) | pastes a key from the Anthropic Console | writes it to a secret file in the staging folder, which the folder's settings read through `apiKeyHelper` |
| Codex | OAuth (`CodexSignIn`) | approves a short device code on OpenAI's page | runs Codex's device sign-in and reads the account back in the same app-server session |
| Codex | API key (`CodexKeySignIn`) | pastes a key from the OpenAI platform | gives it to `codex login --with-api-key` on its standard input, which it then closes |

For each sign-in the runner (`SignInRunner`):

1. ends what still runs on the account's folder first (the drain), and fails the sign-in when that cannot be done;
2. makes a new staging folder under `ACCOUNTS_ROOT` with mode 0700, and files 0600;
3. starts the method's process in a `SignInProcess`: exact arguments and environment, output read into a
   small private buffer that is never logged, recorded or sent;
4. reports `waiting`; the challenge the owner sees (an address, a device code) reaches the form through its own
   no-store endpoint, never through these reports;
5. takes the owner's code, token or key from the code channel; the journal erases it from its side once handed over;
6. checks the folder with the program's own status, and for a token or key also makes one short model call, the only
   proof a token or key works, since the status trusts any value it is given;
7. reports `verified` with the identity it names, or `failed` with the provider's refusal, cut to 300 characters with
   any key replaced by "the key".

A token or key is never stored by the journal itself: the attempt keeps only a keyed fingerprint of it, which tells a
second account on the same key apart from a new one. A verified staging folder is then promoted to be the account's
folder.

## Egress

On a server the sign-in programs reach their providers only through the `egress` proxy that `JOURNAL_EGRESS_PROXY`
names: the runner gives each sign-in, check and sign-out `HTTPS_PROXY`, `HTTP_PROXY` and `NO_PROXY=app`, in both
cases, from `SignInEgress`. On the Mac no proxy is set, and they use the machine's own network.
