# journal-agent

The journal's host for agent programs (doc 40). It runs on macOS and Linux: it serves the journal's driver requests,
starts the pinned Claude Code and Codex builds on saved accounts through the protected host (task 258, doc 57) and
records evidence sessions. How to install and run it, and why a start is refused, is in
[docs/accounts/host-installation.md](../../docs/accounts/host-installation.md).

## Recording a session

```sh
cd tools/journal-agent
go build -o bin/journal-agent ./cmd/journal-agent
bin/journal-agent record --driver claude --mode terminal --out ../../resources/recordings/claude-code/2.1.323/first-prompt -- claude
bin/journal-agent record --driver codex --mode process --out testdata/recordings/codex/0.165.0/one-turn -- codex exec "say hi"
```

`--mode terminal` runs the program in a pseudo-terminal of your size and passes your keys and resizes through.
`--mode process` runs it as one plain child with pipes. Both start it in its own process group.

Press Ctrl-] to mark what you type next as secret, and again to end it. Secret input reaches the program but only
its length is written. Never type a password, token or login code without marking it.

## Where fixtures live

`testdata/recordings/<program>/<build>/<name>/fixture.json`. A fixture holds the program and its version, the
profile, the geometry, every output chunk and input event with its offset, resizes, the redacted start (working
folder, arguments and environment variable names, never their values) and the slots later phases fill: screen
checkpoints, KeyScript parameters, expected keys and expected state transitions.

Fixtures are development evidence. They never contain authentication input. Replaying one (`recording.Replay`)
writes its chunks to an inert sink on a fake clock: no program runs, no account is used and no network is reached.

