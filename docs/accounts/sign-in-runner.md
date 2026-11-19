# The host's sign-in runner

A program's sign-in writes the account's credentials, so it runs on the host, never in the app's containers:
`bin/journal-account` starts `php artisan accounts:run-sign-ins` as the journal's own host user, with `JOURNAL_URL`
and the enrolled host's `JOURNAL_HOST_SECRET`. It talks to the journal over the enrolled host's signed transport
(the bearer secret plus a signature over each call), never with an agent's launch token.

| Route | Command | What it does |
|---|---|---|
| `POST /host/sign-ins/claim` | `ClaimSignIn` | hands the runner the oldest sign-in nobody runs, or 204; an attempt is run by one host only |
| `POST /host/sign-ins/{attempt}/report` (`outcome`, `generation`, `identity`) | `ReportSignIn` | `waiting`, `verified` (saved once, only while live, within its deadline and in its generation) or `failed` |

For each sign-in the runner (`PrivateSignInProcesses`):

1. makes the account folder under the configured accounts root (`ACCOUNTS_ROOT`) with mode 0700, and files 0600;
2. starts the program's own sign-in through its `SignInProtocol` in a `PrivateAccountProcess`: exact arguments and
   environment, standard input kept for the person's code, output read into a small private buffer that is never
   logged, recorded or sent;
3. reports `waiting`, waits until the process ends or the deadline passes, and stops it;
4. runs the program's own check of the folder and reports `verified` with the identity it names, or `failed`.

Only these outcomes leave the host. A program with no installed protocol fails its sign-in. The Claude Code and
Codex protocols are tasks 253 and 254; the challenge the person sees reaches them through the no-store endpoint of
task 256, never through these reports.
