# journal-runner

The journal uses `journal-runner` to run pipe processes, manage containers and relay their output. The remote
project release also ships `journal-terminal`. With that release's `bin` directory on PATH, run
`journal-terminal claude` in the connected project folder. A driver with isolated hooks can run there too, for
example `journal-terminal codex` when the journal offers Codex for that project.

## Recording a session

Run the scenario recorder from the repository root. Terminal scenarios connect a scratch project and run
`journal-terminal` inside a pseudo-terminal. Use the recording tools on an exchange folder containing
`fixture.json`.

```sh
sh scripts/record-scenarios.sh --owner=<email> claude-code/terminal-turn
journal-terminal annotate <exchange-folder>
journal-terminal screen <exchange-folder>
journal-terminal render <recordings-folder>
```

`annotate` adds screen checkpoints after typed input. `screen` prints the final screen. `render` writes
`frames.json` beside each fixture under the supplied folder.

## Where fixtures live

`testdata/recordings/<program>/<build>/<name>/fixture.json`. A fixture holds the program and its version, the
profile, the geometry, every output chunk and input event with its offset, resizes, the redacted start (working
folder, arguments and environment variable names, never their values) and the slots later phases fill: screen
checkpoints, KeyScript parameters, expected keys and expected state transitions.

Fixtures are development evidence. They never contain authentication input. Replaying one (`recording.Replay`)
writes its chunks to an inert sink on a fake clock: no program runs, no account is used and no network is reached.

