#!/usr/bin/env python3
from __future__ import annotations

import contextlib as _contextlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import app
import commands
import fmt
import help
import tracks
from app import root
from app import refuse as _refuse, stem as _stem
from templates import render

TEXT = {
    "worktree_note": "  {note}",
    "no_environment": "no environment is called {name}; `journal environments` lists them, `journal switch` or "
                      "`journal prepare` creates one",
    "no_such": "No such command: {verb}\n",
    "unbound": "`journal {verb}` reads or writes an environment, and this session is on none yet. There is no "
               "default one: pick where this work belongs and everything below it answers.\n{have}\n"
               "  journal switch \"<name>\"   put this session on one\n"
               "  journal prepare \"<name>\"  make a new one and go there",
    "unbound_row": "  {name}",
    "unbound_none": "  (no environments yet)",
    "help_head": "journal {verb}\n",
}

app.start(Path(__file__))
_ROOT, _WT_NOTE = app.ROOT, app.WORKTREE_NOTE
if _WT_NOTE:
    fmt.say(render(TEXT["worktree_note"], note=_WT_NOTE), error=True)


fmt.cli(_ROOT)   # the spelling every printed command uses, from here


import state as _state
#: `--env=` IS READ BEFORE ANYTHING ELSE, so it has to honour the `--` separator here too:
#: the flag loop in `main` stops at a bare `--`, and a module-level scan that did not would
#: still eat an `--env=` that was meant as payload. Same rule, both places.
_ARGV = sys.argv[1:sys.argv.index("--")] if "--" in sys.argv[1:] else sys.argv[1:]
_ENV_FLAG = next((a.split("=", 1)[1] for a in _ARGV if a.startswith(("--env=", "--environment=", "--track="))), "")
if _ENV_FLAG:
    # THE REFUSAL LIVES WHERE THE FLAG IS HANDLED, and for a while it did not: the flag was
    # applied here and validated again, to no effect, in the option loop three hundred lines
    # down. Two places to change, one of which only complained — and a reader looking for
    # how the flag works found the half that does nothing.
    _ENV_FLAG = _state.slug(_ENV_FLAG) or "default"
    if _ENV_FLAG not in tracks._all(_ROOT):
        fmt.say(render(TEXT["no_environment"], name=repr(_ENV_FLAG)), error=True)
        raise SystemExit(1)
    tracks.override(_ENV_FLAG)
_state.use_track(tracks.current(_ROOT, _stem()))
#: `--as=<agent>` POINTS THE LEDGER AT A SUBAGENT'S OWN FOLDER, and nothing else: pins and
#: reminders stay the environment's. Read here beside `--env=` because both have to be in
#: force before any command reads the record.
_AS = next((a.split("=", 1)[1] for a in _ARGV if a.startswith("--as=")), "")
#: AND THEY GO BACK ON EVERY COMMAND THIS INVOCATION PRINTS — see `fmt.acting_as`. Here
#: because it is where both flags are known, and because a refusal's text is built long
#: before the option loop three hundred lines down has run.
fmt.acting_as(_ENV_FLAG, _AS)
if _AS:
    _state.use_agent(_AS)
    with _contextlib.suppress(Exception):
        import agents as _ag
        _ag.touch(_ROOT, tracks.current(_ROOT, _stem()), _AS)





def _help(verb: str = "") -> int:
    if not verb:
        fmt.say(__doc__)
        return 0
    lines = help.lines(verb)
    if not lines:
        gone = _retired(verb)
        if gone is not None:
            return gone
        fmt.say(render(TEXT["no_such"], verb=verb), error=True)
        fmt.say(__doc__, error=True)
        return 1
    fmt.say(render(TEXT["help_head"], verb=verb))
    # THROUGH THE SAME RENDERER AS EVERY OTHER COMMAND LIST. These lines were printed with a
    # four-space prefix straight to `say`, and `block` passes an already-indented line
    # through untouched however long it is — so no help screen was ever wrapped by anything.
    # Measured: `journal cleanup help` had a 302-character line, `environments help` 271,
    # and most lines in every group sat between 90 and 160. Splitting on the run of spaces
    # the lines already use to separate a command from its description turns them into the
    # rows `fmt.commands` was built for, and one width guarantee now covers both surfaces.
    # A GROUP IS COMMANDS AND SOMETIMES A SENTENCE. A line with no description column is
    # prose — a ruling, a note about a setting — and it wraps rather than pretending to be a
    # command nobody can type. The command rows either side of it stay aligned as one block.
    rows: list = []
    out: list = []
    for l in lines:
        cmd, sep, what = l.partition("   ")
        if sep and what.strip():
            rows.append((cmd.rstrip(), what.strip()))
            continue
        if rows:
            out.append(fmt.commands(rows, indent=4))
            rows = []
        out.append(fmt.wrap(l.strip(), indent=4))
    if rows:
        out.append(fmt.commands(rows, indent=4))
    fmt.say("\n".join(out))
    return 0





def _retired(verb: str) -> int | None:
    got = help.retired(verb)
    if not got:
        return None
    why, commands, then = got
    # ONE `say`, BECAUSE `say` MARKS WHAT IT IS GIVEN. It puts `! ` on the first line of
    # every call, so five calls made five refusals out of one — the marker means "this is
    # the refusal", and repeated down a page it means nothing.
    return _refuse("\n\n".join((fmt.wrap(why), fmt.commands(commands), fmt.wrap(then))))


def _dispatch(argv: list[str]) -> int:
    parsed, why = commands.REGISTRY.parse(argv)
    if not parsed:
        return _refuse(why)
    if _stem() and _state.current_track(_ROOT):
        try:
            import commandlog
            from app import now
            at = now()
            # the tool uses queued before this command end with it; written first, so newest-first lists them under it
            commandlog.flush_tools(_ROOT, _state.current_track(_ROOT), _stem(), at)
            commandlog.record(_ROOT, _state.current_track(_ROOT), parsed, at)
        except Exception as e:  # the activity line must never stop the command
            print(f"journal activity: {e}", file=sys.stderr)
    return parsed.command.run(parsed)



#: the verbs that answer without an environment: they choose one, describe the project rather
#: than a line of work, or run the machinery. EVERYTHING ELSE READS OR WRITES AN ENVIRONMENT,
#: and there is no default one to read — so it is refused until this session has picked.
UNBOUND_OK = frozenset((
    "environments", "switch", "claim", "prepare", "worktree", "grant", "grants", "lent",
    "rules", "docs", "tools", "style", "settings", "migrate", "upgrade", "version",
    "verify", "serve", "statusline", "auto-mode", "enable", "disable", "claude",
))


def _unbound_refusal(verb: str) -> str:
    if verb in UNBOUND_OK or tracks._OVERRIDE or not _stem():
        return ""
    if tracks.current(_ROOT, _stem()):
        return ""
    names = tracks.choices(_ROOT)
    have = [render(TEXT["unbound_row"], name=n) for n in names] or [render(TEXT["unbound_none"])]
    return render(TEXT["unbound"], verb=verb, have="\n".join(have))


def main(argv: list[str]) -> int:
    # BEFORE ANY COMMAND READS THE RECORD. A record written by an older version is migrated
    # by whichever process notices first; this is the one that notices most often. Except
    # for `migrate` itself: a status that has already acted is a status nobody can read.
    if not (argv and argv[0] in ("migrate", "migrations")):
        import migrate
        for line in migrate.ensure(root()):
            print(line, file=sys.stderr)
    # HELP WORKS AFTER ANY VERB, and an unknown option is refused rather than kept as
    # words. `journal todos --help` used to add a to-do titled "--help": help was only
    # recognised as the first word, and anything else starting with `--` fell through
    # into the text. A flag nobody declared is a typo, and a typo filed as a title is a
    # write that reports success and lands wrong.
    if len(argv) >= 3 and argv[0] == "tools" and argv[1] == "run":
        import tools
        return tools.run(root(), argv[2], argv[3:])
    # `help` IS A WORD IN VERB POSITION, NOT A WORD ANYWHERE. Matching it across the whole
    # of argv meant a payload could ask for help instead of being written: `journal search
    # help` could never search for the term, and `journal pins add "help"` was a request
    # for the pins synopsis rather than a pin. A flag is different — `-h`/`--help` is a
    # flag wherever it appears, because no payload is spelled with leading dashes.
    if any(a in ("-h", "--help") for a in argv) or "help" in argv[:2]:
        verb = next((a for a in argv if not a.startswith("-") and a != "help"), "")
        return _help(verb)
    first = next((a for a in argv if not a.startswith("--")), "")
    if not first and any(a.startswith("--back") for a in argv):
        argv, first = ["conversation", *argv], "conversation"
    if commands.REGISTRY.knows(first):
        held = _unbound_refusal(first)
        if held:
            return _refuse(held)
        return _dispatch(argv)
    if first:
        gone = _retired(first)
        if gone is not None:
            return gone
        fmt.say(render(TEXT["no_such"], verb=first), error=True)
        fmt.say(__doc__, error=True)
        return 1
    held = _unbound_refusal("status")
    if held:
        return _refuse(held)
    return _dispatch(["status", *argv])


def run(argv: list[str]) -> int:
    _state._CACHE.clear()
    tracks.override("")
    flag = next((a.split("=", 1)[1] for a in argv
                 if a.startswith(("--env=", "--environment=", "--track="))
                 and "--" not in argv[:argv.index(a)]), "")
    if flag:
        name = _state.slug(flag) or "default"
        if name not in tracks._all(_ROOT):
            fmt.say(render(TEXT["no_environment"], name=repr(name)), error=True)
            return 1
        tracks.override(name)
    _state.use_track(tracks.current(_ROOT, _stem()))
    # THE SAME SET-UP AS THE MODULE-LEVEL BLOCK, for the same reason: `--as=` has to be in
    # force before any command reads the record, and this door is how the suites call in.
    _state.use_agent("")
    acting = next((a.split("=", 1)[1] for a in argv if a.startswith("--as=")), "")
    if acting:
        _state.use_agent(acting)
        import agents as _ag
        _ag.touch(_ROOT, tracks.current(_ROOT, _stem()), acting)
    # AND THE FLAGS THIS INVOCATION CARRIED, PER INVOCATION. The module-level call is right
    # for the CLI, where a process is one command; in here it would be read once and then be
    # wrong for every command after the first — which is exactly what the suites do.
    fmt.acting_as(flag, acting)
    return main(argv)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
