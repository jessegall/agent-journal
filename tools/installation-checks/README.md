# Installation checks

**These checks start real containers and real agent sessions on a running journal. They are never part of
`composer test`:** PHPUnit finds nothing here (an architecture test fails if it could), and `journal test-affected`
never picks them. Run them on purpose, against a journal you may start sessions on.

    composer installation-checks -- protected-session claude-code
    php tools/installation-checks/run.php protected-session codex --skip-renewal
    php tools/installation-checks/run.php protected-session claude-code --origin=https://journal.example

Each check prints one line per item, `pass` or `fail` with the reason, never a token or the canary, exits non-zero when
any item fails, and writes its outcomes to `storage/acceptance/<check>-<driver>-<time>.json`.

The checks run from the checkout of the journal they check: they reach its containers with `docker compose`, and its
pages at `--origin` (by default `http://localhost:54700`), signed in as `--email` and `--password` (by default the seed
owner, `owner@journal.local` and `password`).

## protected-session

Tasks 1772 and 1773: a protected headless session on the cheapest model (Haiku for Claude Code, Luna for Codex) is
started through the same request the Start dialog sends, and `tools/accounts/isolation-probe.php` sets a marker and a
canary in its container. Every item is a chat message to the session, judged by the tool results in its transcript:

1. the workspace marker reads, through Bash and through the native Read tool;
2. `id -u` is 10002, the executor's user;
3. the canary and the credential file are refused with a permission error, never a missing file: directly, through a
   workspace link to the account folder, through `/proc/<client pid>/root`, and with the native Read tool;
4. the environment and `/proc/self/fd` hold no credential;
5. a question is answered;
6. the credential's expiry before and after it renews (left out with `--skip-renewal`);
7. after a stop and a start, with no sign-in, a question is answered and the read checks hold again.
