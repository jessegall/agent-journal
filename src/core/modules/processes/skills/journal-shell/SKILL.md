---
name: journal-shell
description: Run shell commands through the journal and read what they printed; read it before reading an output, or writing a reader or an alias
---

# Shell commands

Every shell command you run goes through the journal's runner.

## Outputs

- A command that runs past its time limit moves to the background and gives you its output number N.
- `output N ended: <result>` means it finished. `output N unread` means you have not read it yet.
- Read it with `journal output read N --summary`, which gives its reader's lines and how it ended.
- Other parts: `--tail 20`, `--head 20`, `--grep "<words>"`, `--lines 100-160`, `--all`.
- `process N was lost` means its shell went away: read what it printed the same way.
- Read an output this way, never by running the command again.
- Wait on a run with a Monitor on `journal output monitor N`; never ask for its status again and again.
- Name a run for the user with `journal output title N "<what it does>"`: a whole phrase such as Running tests.

## Readers

- A reader picks the lines that matter from one kind of output:
  `journal reader add <name> --commands "pytest*" --lines "<pattern>"`.
- A reader says what a run is doing with `--title`, how far it is with `--progress` and how it ended with `--summary`.
- `journal reader list` names them. Adding a reader under a name that exists replaces it.
- A pipe or a redirect hides the output from its reader, so run a test or a build without them.

## Aliases

- `journal alias add <name> "<line>"` names a command line of the project; then `journal <name>` runs it.
- `journal alias list` names them.

## Running journal commands

- A journal command runs on its own, or chained only with other journal commands.
- Never cut a journal command with a pipe: use its flags.
