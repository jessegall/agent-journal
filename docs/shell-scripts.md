# Shell scripts

How every shell script in this project is written (rules 76, 77 and 78).

## Shape

A script is a list of steps you can read from the top.

```sh
#!/bin/sh
# What the script does, in at most three lines, with how to call it.
set -eu

main() {
    load_config
    fetch_commit
    extract_files
    install
}

fetch_commit() {
    ...
}

main "$@"
```

- `main` comes first and only calls steps, in order. `main "$@"` is the last line.
- A step is a small function named verb_noun: `fetch_commit`, `pin_images`, `run_migrations`, `check_front_door`.
  No articles and no sentences: never `name_the_places`.
- A step has at most one line of comment above it, and only for a why the name cannot say.
- No comment block is longer than three lines. A longer explanation belongs in a document.

## Shell only

A script holds shell and nothing else.

- Python, PHP or any other language is a file of its own with a plain name, next to the script that calls it:
  `python3 .docker/updater/services-mounting.py "$root" "$changed"`.
- JSON or other text a script writes comes from a template file, filled with `fill_template`.
- A script another program runs, such as a command of a compose service or a line run in a container, is a file too,
  never text inside `compose.yaml` or inside another script.

## The shared library

Code two scripts need lives once in `scripts/lib` and is sourced.

| File | Gives |
|---|---|
| `scripts/lib/settings.sh` | `setting NAME` reads a setting of `.env`; `set_setting NAME VALUE` writes one |
| `scripts/lib/templates.sh` | `fill_template FILE name=value ...` prints a template with each `{{name}}` replaced |
| `scripts/lib/arguments.sh` | `option_after --tag "$@"` gives the value that follows an option |

## Tests

Everything a script does with Docker is tested against a stand-in Docker in the normal test suite.

- `tests/Support/Installation/bin` holds the stand-ins put first on `PATH`: `docker` records each call and answers as a
  healthy Docker would, `curl` answers every address, `sleep` ends a script that starts to wait.
- `Tests\Support\Installation\StandInInstallation` is a temporary installation that follows a real local git
  repository; a test pushes commits to it and runs the real script.
- `tests/Feature/Installation` holds the scenarios. A change to a script ships with its scenario in the same commit.
- The normal suite never reaches a real Docker.
- The Go host runs no `docker` command: it talks to the daemon through Docker's own Go client
  (`tools/journal-agent/host/daemon.go`). Its tests talk to `tools/journal-agent/dockerstandin`, a stand-in daemon that
  speaks the Docker Engine API, keeps containers, volumes and networks in memory and runs the program a test gives a
  container. `tools/journal-agent/architecture/docker_client_test.go` fails on Go code that runs the command line.
