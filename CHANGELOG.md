# Changelog

Newest first. Each entry is what changed, what it makes possible, and what to do about it.
`journal upgrade` prints the entries since the version you had; a session started on a
newer version than the last one it saw is handed the same.

## 1.8.0 — tool-shaped work is noticed; reload the skill after an update

A script written into a scratch or scripts folder, the same long inline script run twice,
or a scratch script run by name earns a one-time hint to catalogue it as a tool. After an
update the agent is told to reload the journal skill.

After updating: reload the `journal` skill.

## 1.7.0 — tools

Scripts the agent keeps for repeated work, catalogued under `.journal/tools/<name>/` with
a `tool.md` (title, summary, usage, when, entry point) and run with `journal tools run
<name> …`. Every session is handed the catalogue. `journal tools index` adopts folders
already there; `--entry` can point at a script anywhere in the project.

After updating: catalogue the scripts you already have.

## 1.6.0 — one-line holds, `journal next`, and a loop for auto mode

Every hold at a stop is one line; anything longer is behind `journal next`, which the
line names. With auto on, the agent is asked to keep a loop running that prompts
`journal next` every `auto_loop_minutes` (default 15), so an idle session comes back and
carries on until nothing is left it can do. The auto texts say "auto mode is on" rather
than "the user is away".

Nothing to do after updating.

## 1.5.2 — two fixes from a multi-repo workspace

`install.py --alias` removes the alias 1.3.x wrote into your shell rc, which shadowed the
new launcher and kept `journal` broken; an alias it did not write is named so you can
delete it. The gates read `python3 .journal/journal.py …` as the journal, so a context
warning can be answered in that form too.

After updating: run `.journal/install.py --alias` once, then open a new terminal.

## 1.5.1 — the `journal` command works without git

It finds the project by walking up to the nearest `.journal/`. Run `.journal/install.py
--alias` once to get the new launcher.

## 1.5.0 — `journal work start|update|end`; `journal update` updates the journal

The work commands are a family: `journal work start "…"`, `journal work update "…"`,
`journal work end "…"`. That frees `journal update` to mean updating the journal itself
(`journal upgrade` still works). The old `journal start` and `journal end` keep working;
`journal update "<text>"` now tells you to use `work update`.

After updating: use `journal work update` for notes on the open work.

## 1.4.0 — a `journal` command for every shell

`--alias` now installs a `journal` script in ~/.local/bin instead of a zsh/bash alias, so
it works in any shell; the installer says the one PATH line to add if needed. The README
explains the tags that appear at the start of the agent's messages.

After upgrading: run `.journal/install.py --alias` once to get the command; the old alias
in your shell rc keeps working and can be removed.

## 1.3.2 — a short install

The installer prints what it changed, "Installed.", and the one next step. Nothing to do after upgrading.

## 1.3.1 — install ends with next steps

The installer no longer runs checks that cannot pass before Claude Code has started; it
says what it wired and what to do next. `journal verify` from a plain terminal reports
"not fired yet" and "window not yet known" as facts, not failures.

Nothing to do after upgrading.

## 1.3.0 — the context window is learned

No setting needed: the window is learned at the first compaction (the peak before it is
the window) or from the session's peak once it rules out every window but one. The
`context_window` setting is an override. The README gained a settings section.

Nothing to do after upgrading; a `context_window` you set still wins.

## 1.2.3 — README commands, two columns again

Nothing to do after upgrading.

## 1.2.2 — README wording

How it works says the transcript is Claude Code's default behaviour, built on rather than replaced. Nothing to do after upgrading.

## 1.2.1 — README commands

One command per line with its meaning beneath; agent-only commands marked. Nothing to do after upgrading.

## 1.2.0 — docs live in .journal/docs

The catalogue's folder is `.journal/docs/` by default, beside the record and the to-dos,
so everything the journal keeps is in one place. A project that keeps its docs elsewhere
sets `docs_dir` in `.journal/settings.json`. Pulls never touch a project's docs.

After upgrading: if you had catalogued docs under `docs/`, move them to `.journal/docs/`
or set `"docs_dir": "docs"`.

## 1.1.6 — README: how does it work

A section at the bottom on the transcript, tags, line numbers, tracks, compaction and the hooks. Nothing to do after upgrading.

## 1.1.5 — README wording

The commands section opens with who runs what and nothing else. Nothing to do after upgrading.

## 1.1.4 — README features as headings

Each feature in the README has its own small heading. Nothing to do after upgrading.

## 1.1.3 — holds are one line; the README rewritten

Every hold at a stop now carries only its one-line instruction; the reasoning is in the
skill's hold table. Only the context warning keeps its text, because that text is what the
agent decides with. The README is rewritten: what it is, what it does, install, features,
commands — with the commands you run and the agent runs told apart.

Nothing to do after upgrading.

## 1.1.2 — a pull from a URL no longer copies the clone's .git

Upgrading from the repository copied the clone's `.git` folder into `.journal/`, a nested
repository nobody wanted. It is excluded. If you upgraded on 1.1.1, `rm -rf .journal/.git`.

## 1.1.1 — a pull no longer runs the test suites

`journal upgrade` and `install.py --from` copy the package and stop. The suites ran in a
staging directory before every pull and cost minutes per upgrade; they run where the
package is developed now. `install.py --from <src> --test` runs them if you want.

Nothing to do after upgrading.

## 1.1.0 — the README, and a fix to `install.py --from <url>`

The package now ships its README: what the journal is, how to install it in one line,
every command with what it does, and how it holds the agent to the rules. Read it once;
it is the human-readable version of the skill.

`install.py --from` takes a git URL as well as a path (1.0.0 folded the URL into a path).
`journal upgrade` was unaffected.

Nothing to do after upgrading.

## 1.0.0 — the first public release

The journal as it stands: tags on every message, declared work with a gate on writes,
pins and rules, to-dos with `ask`, `answer` and `auto`, a docs catalogue over `docs/`,
tracks, the context ladder that forces a decision, search across a track's sessions, and
`verify` that tells wired from fired.

Nothing to do after installing: `.journal/install.py --alias` wires the hooks and the
skill; `journal verify` says whether it is live.
