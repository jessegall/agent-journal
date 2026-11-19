# journal-agent

The journal's host for agent programs (doc 40). It runs on macOS and Linux. For now it records evidence sessions;
the drivers come in later phases of plan 26.

## Recording a session

```sh
cd tools/journal-agent
go build -o bin/journal-agent ./cmd/journal-agent
bin/journal-agent record --program claude --mode terminal --out testdata/recordings/claude/2.1.323/first-prompt -- claude
bin/journal-agent record --program codex --mode process --out testdata/recordings/codex/0.165.0/one-turn -- codex exec "say hi"
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

## Key scripts

`keyscripts` drives a terminal program's menus. A script selects a menu entry by its label only, one key at a time,
each after the screen it expects is read. At a point it cannot be certain of (a label missing or shown twice, a
highlight not on the entry, a screen that is not the expected one) the run ends `NavigationNeeded` with an
`Uncertainty`, sends no key and stays resumable at that step; the host then asks the journal. A script that runs to
its end without proving its result is reported unconfirmed.

- `runner.go` runs and resumes scripts; `uncertainty.go` describes where a run stopped.
- `entry.go` is a library entry: a key script the same runner replays, with a fingerprint expectation and a proof
  check per step. A failed check stops before its key.
- `navigation.go` takes the main agent's rounds through the input gate and checks the proof on screen; `path.go` turns
  a proven request's rounds into an entry's steps.
- `registry.go` holds the scripts each program build may run; `Registry.Find` falls back to the newest registered
  build of the same program, whose script still waits for each screen it expects.
- The screen package reads what the scripts act on: the fingerprint of a stable screen (`screen/fingerprint.go`),
  the region of a menu's options (`screen/option_region.go`), text normalised before it is compared
  (`screen/normalise.go`), the one lossless proof check (`screen/proof.go`) and what may leave the host
  (`screen/export.go`). A screen that asks for a secret stops the run and exports nothing.
