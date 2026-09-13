#!/usr/bin/env python3
"""journal — a session survives its own compaction.

A compaction keeps what was DONE and loses what was DECIDED. The transcript on disk lost
nothing. This is the index that gets you back to it.

    journal                 where things stand: environment, rules, pins, open work, to-dos, context
    journal next            what to do now: the details of the last hold, or the next to-do

Every group below prints its own commands, and so does every spelling of them:
`journal <noun> help`.

    work           declare it, move it, wait on something, close it
    ideas          a stray line, global, no promise attached — not a pin, not a to-do
    pins           a claim that must survive a compaction, on this environment
    rules          a pin that every environment obeys
    reminders      an instruction said again at every stop, until you retire it
    questions      a question of its own, linked to to-dos, docs, pins or rules
    todos          delayed work, parked with the brief you will need in a week
    docs           what was settled: findings, reports, the reasoning a pin cites
    tools          scripts kept for repeated work
    environments   where work lives: switch, prepare, claim, worktree
    cleanup        what has evidence against it: stale rules, pins, docs, empty environments
    transcript     read it back: conversation, user, search, carry
    system         verify, version, update, settings, loop

THE PLURAL NOUN IS THE CANONICAL SPELLING (ruling R10). Every singular and legacy one —
`pin`, `rule`, `todo`, `tracks`, bare `strike` and `promote` — still runs,
still answers `help`, and calls the very same function. None of them is deprecated.
"""
from __future__ import annotations

import contextlib as _contextlib
import os
import sys
from pathlib import Path
from typing import NamedTuple

sys.path.insert(0, str(Path(__file__).resolve().parent))

import fmt
import help
import settings as settings_mod
import commands
import ideas
import questions
import pins
import reminders
import todo
import tracks
import transcript
import work


class _Lazy:
    """A module imported the first time something is read from it, and not before.

    NINETEEN MODULES WERE IMPORTED FOR A COMMAND THAT USES TWO. `journal open` paid 7.7ms
    for `docs` (which pulls `shutil`), 3.4ms for `tools` (`subprocess`), and more for
    `migrate`, `update`, `verify` and `context` — none of which it touches — out of a start
    that is ~110ms in total. The cost is charged to every hook event and every command.

    ONE OBJECT INSTEAD OF FORTY EDITS. The alternative was `import docs` inside each of the
    twenty-eight functions that use it, which is the same decision written twenty-eight
    times and one more thing to forget on the twenty-ninth. This keeps every call site
    exactly as it reads — `docs.get(...)` — and moves the import to first use.

    WHAT IS NOT LAZY, AND WHY. Anything the module-level block below needs while it runs:
    the environment resolution, the `--env=` scan, the record. Deferring one of those would
    not remove a cost, it would move a SIDE EFFECT — and a CLI that resolves its environment
    lazily is one whose commands can disagree about which environment they are on. That is
    the failure 1.34.0 was spent fixing, and it is not worth 7ms.
    """

    __slots__ = ("_name", "_mod")

    def __init__(self, name: str):
        self._name = name
        self._mod = None

    def __getattr__(self, attr: str):
        if self._mod is None:
            import importlib
            object.__setattr__(self, "_mod", importlib.import_module(self._name))
        return getattr(self._mod, attr)


#: Imported on first use — see `_Lazy`. Each is touched by a handful of commands and by no
#: code path that runs on every invocation.
docs = _Lazy("docs")
tools = _Lazy("tools")
context = _Lazy("context")
migrate = _Lazy("migrate")
update = _Lazy("update")
verify = _Lazy("verify")



import app
from app import BRIEF_REFUSED, CATALOGUE_PAGE, PAGE, project, root
from app import brief as _brief, catalogue as _catalogue, doc_where as _doc_where, now as _now
from app import refuse as _refuse, stem as _stem, where as _where

app.start(Path(__file__))
_ROOT, _WT_NOTE = app.ROOT, app.WORKTREE_NOTE
if _WT_NOTE:
    fmt.say(f"  {_WT_NOTE}", error=True)


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
        fmt.say(f"no environment is called {_ENV_FLAG!r}; `journal environments` lists them, "
                "`journal switch` or `journal prepare` creates one", error=True)
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
    """The index, or the commands of one group — `help.py` holds the only list of them.

    THE INDEX IS WHAT `--help` COSTS NOW. It named 72 commands in 77 lines at every `-h`,
    every `--help` and every unknown verb, in a package whose whole argument is that output
    is charged to the reader. The lines are not gone; they are one command away, under the
    noun that owns them, which is also where a reader looking for a verb would think to ask.
    """
    if not verb:
        fmt.say(__doc__)
        return 0
    lines = help.lines(verb)
    if not lines:
        gone = _retired(verb)
        if gone is not None:
            return gone
        fmt.say(f"No such command: {verb}\n", error=True)
        fmt.say(__doc__, error=True)
        return 1
    fmt.say(f"journal {verb}\n")
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


def cmd_status() -> int:
    """Where things stand, on one screen. What bare `journal` shows.

    The bare command used to print the conversation, which is the one output nobody wants
    by accident: long, and not what a person glancing at the journal is asking. What they
    are asking is "what is the state of this thing" — the environment, what stands, what waits.
    """
    conf, problems = settings_mod.load(root())
    for p in problems:
        fmt.say(f"{p}", error=True)
    here = tracks.current(root(), _stem())
    ruled = len(pins.live(root(), pins.RULES))
    pinned = len(pins.live(root()))
    standing = work.open_work(root())
    waiting = todo.open_items(root(), here)
    on_user = todo.asking(root(), here)
    others = [t["name"] for t in tracks.listing(root()) if not t["current"]]
    rows = [
        ("environment", here + ""
         + (f"   (parked: {', '.join(others)})" if others else ""), "journal environments"),
        ("rules", f"{ruled} in force on every environment" if ruled else "none", "journal rules"),
        ("pins", f"{pinned} standing on this environment" if pinned else "none", "journal pins"),
        ("reminders", (lambda r: f"{len(r)} repeated at every stop" if r else "none")(reminders.live(root())),
         "journal reminders"),
        ("open work", (f"{len(standing)} open: " + "; ".join(w["subject"] for w in standing))
         if standing else "none", "journal open"),
        ("docs", (lambda c: f"{len(c)} catalogued" + (f", {len([d for d in c if d.get('status') != 'final'])} draft(s)"
                                                       if any(d.get('status') != 'final' for d in c) else ""))(docs._load(root()))
         if docs._load(root()) else "none", "journal docs"),
        ("tools", f"{len(tools._all(root()))} catalogued" if tools._all(root()) else "none", "journal tools"),
        ("to-do", (f"{len(waiting)} waiting" if waiting else "none")
         + (f", {len(on_user)} on the user" if on_user else "")
         + (f", {len(todo.answered(root(), here))} answered" if todo.answered(root(), here) else "")
         + (", auto on" if todo.auto(root(), here) else ""), "journal todo"),
    ]
    got = transcript.session_transcript(project())
    if got:
        import state as _st
        read = context.pressure(got[0], conf["context_window"], _st.get(root(), "window", 0) or 0)
        if read and read[3]:
            rows.append(("context", f"{read[0]:.0%} full ({read[1]:,} of {read[2]:,})", ""))
        elif read:
            rows.append(("context", f"{read[1]:,} tokens; window not yet known (learned at the first compaction)", ""))
        if got[1]:
            rows.append(("transcript", f"guessed: {got[0].name} (no session id in the environment)", ""))
    import state as state_mod
    sid = os.environ.get(transcript.SESSION_ENV, "")
    mine = dict(state_mod.runtime_files(root())).get(sid, {}) if sid else {}
    disabled = not _state.hooks_enabled(root())
    rows.append(("hooks",
                 "DISABLED — nothing is held, gated or filed" if disabled else
                 "fired in this session" if mine else "nothing has reached the hook in this session",
                 "journal enable" if disabled else "journal verify"))
    up = update.check(root())
    have = update.current(root())
    rows.append(("version", have + (f"  ({up['version']} available: journal upgrade)"
                                    if up.get("version") and update.newer(up["version"], have) else ""), "journal version"))
    fmt.say(fmt.title("JOURNAL", sub=f"environment {here}"))
    fmt.say()
    fmt.say(fmt.facts(rows))
    if on_user:
        fmt.say(fmt.section("waiting on the user"))
        for t in on_user:
            fmt.say(fmt.numbered(t["n"], t["title"]))
            fmt.say(fmt.wrap(t["asks"], indent=5))
    fmt.say()
    fmt.say(fmt.commands([
        ("journal conversation [--back=N]", "what was said, since the last compaction or before it"),
        ("journal search <term>", "every line mentioning it on this environment, and who said it"),
        ('journal pins add "<claim>" [--doc=<doc>]', "a fact that must outlive a compaction; --doc ties it to a doc, by number or name"),
        ("journal help", "every command"),
    ]))
    return 0










#: A LISTING SHOWN BY DEFAULT COSTS CONTEXT EVERY TIME; a search was asked for. So the














def cmd_serve(port: int | None, open_browser: bool) -> int:
    """Start the local web viewer: a read-only browser over this journal.

    A THIN WRAPPER, DELIBERATELY. `serve.py` knows how to bind a socket and answer JSON;
    this only supplies the two paths every command already has (`root()`, `project()`)
    and turns the module's own refusal (a busy port raises `SystemExit`) into this
    command's exit code, the same as every other verb here.
    """
    import serve
    try:
        serve.run(root(), project(), port=port or serve.DEFAULT_PORT, open_browser=open_browser)
    except SystemExit as e:
        return e.code if isinstance(e.code, int) else 1
    return 0






def cmd_loop(args: list[str]) -> int:
    import state as _st
    stem = _stem()
    if not stem:
        fmt.say("`journal loop` is the session's: run it from inside one", error=True)
        return 1
    if args and args[0] == "set":
        _st.put(root(), "loop_set", True, stem=stem)
        fmt.say("noted: this session has a loop running; the stop queue will not ask for one")
        return 0
    if args and args[0] in ("unset", "off"):
        _st.put(root(), "loop_set", False, stem=stem)
        fmt.say("noted: no loop; with auto on, the next stop asks for one")
        return 0
    known = bool(_st.get(root(), "loop_set", False, stem=stem))
    conf, _ = settings_mod.load(root())
    fmt.say(("a loop is known to be running in this session" if known else "no loop is known in this session")
          + f" — with auto on, one is asked for: the `loop` skill with `{conf['auto_loop_minutes']}m journal next`")
    return 0




def cmd_cleanup(every: bool) -> int:
    import cleanup
    conf, _ = settings_mod.load(root())
    fmt.say(cleanup.report(root(), tracks.current(root(), _stem()), every,
                           conf["session_stale_hours"]))
    return 0


def cmd_cleanup_read() -> int:
    """The half no check can do: every rule and pin, in full, to be judged by a reader."""
    import cleanup
    fmt.say(cleanup.reading(root(), tracks.current(root(), _stem()), _now()))
    return 0








def _set_enabled(on: bool) -> int:
    _state.set_hooks_enabled(root(), on)
    fmt.say("hooks ENABLED: every hold, gate and reminder is back in force."
            if on else
            "hooks DISABLED: nothing is held, gated, filed or reminded until "
            "`journal enable` — only run this because the user asked for it, by name.")
    return 0


def cmd_enable() -> int:
    """`journal enable` — turn every hook this package wires back on. The undo for
    `journal disable`; see its docstring for what "off" means and who may say so."""
    return _set_enabled(True)


def cmd_disable() -> int:
    """`journal disable` — the kill switch for every hook this package wires.

    ONLY THE USER TYPES THIS. It makes every hook event inert — no hold, no gate, no
    context, nothing filed — silently, and that is exactly the shape of thing an agent
    must never reach for on its own to get past a hold it does not like. An agent
    reading this: run `disable` ONLY when the user has explicitly asked for it, by
    name, in the conversation — never to route around a hold, a gate or a refusal.

    The CLI itself is never gated by this switch, on or off — it is the hook that goes
    quiet, not the commands you type; `journal enable` is exactly as unblocked while
    disabled as everything else, which is what makes turning it back on always possible.
    """
    return _set_enabled(False)


def cmd_settings() -> int:
    """Every setting, what it is, and — the half this used to promise and not print — the
    order the stop queue runs in.

    THE COLUMNS ARE MEASURED, NOT GUESSED. They were padded to a hardcoded 24 and 22, and
    `one_session_per_environment` is 27 characters, so that one row shoved its value column
    three places right and the table stopped being a table. Nothing here knows how long the
    longest key is except the keys.
    """
    # THE REGISTRY IS FILLED BY hook.py's DECORATORS, so `nudges` alone answers with an
    # empty list — which is how this printed a heading and no rows the first time it was
    # written. Imported here rather than at module scope: the CLI's start-up time is a
    # measured thing, and one command needs this.
    import nudges
    import hook  # noqa: F401 — registers the subjects
    conf, problems = settings_mod.load(root())
    f = root() / settings_mod.PATH
    changed = [k for k in settings_mod.DEFAULTS if conf[k] != settings_mod.DEFAULTS[k]]
    # THE ORDER IS A SETTING WITH NO ROW OF ITS OWN. `stop_priority` prints as `{}` like any
    # other key, while settings.py has promised since it was written that "`journal
    # settings` shows the order in force". A setting whose effect cannot be seen is the
    # failure this module was built to report, so the queue is a section of its own.
    fmt.say(fmt.Out(
        title="SETTINGS",
        sub=str(f) if f.is_file() else "no file, every default in force",
        items=tuple(
            fmt.Item(title=("* " if k in changed else "  ") + k, text=str(conf[k]),
                     meta=f"default {d}" if k in changed else "")
            for k, d in settings_mod.DEFAULTS.items()
        ) + (
            fmt.Item(text="* set in settings.json"),
        ) * bool(changed) + (
            fmt.Out(title="THE STOP QUEUE, IN THE ORDER IT RUNS",
                    items=tuple(fmt.Item(title=name, text=str(n))
                                for name, n in nudges.priorities(conf))),
        ),
        footer='One subject is raised per stop, lowest number first. `stop_priority` moves '
               'one: {"work": 1} puts open work at the head. `silenced` turns one off by '
               "name, and is the way to quiet a single subject.",
    ))
    for p in problems:
        fmt.say(p, error=True)
    return 1 if problems else 0


#: ─────────────────────────── one refusal, for every missing argument ────────────────────
#:
#: THIRTY HAND-WRITTEN REFUSALS SAYING THE SAME TWO THINGS. Every noun's verbs checked their
#: own arguments and wrote their own complaint — "pins strike wants a pin NUMBER, got 'x'.
#: `journal pins` numbers them." — thirty times, with ten separate spellings of "numbers
#: them" that had already drifted in capitalisation, punctuation and whether the offending
#: word was quoted back. A refusal is the thing a reader meets at their worst moment; it is
#: the last text in this package that should be improvised per site.
#:
#: THE TWO SHAPES ARE ALL THERE ARE. A verb wants WORDS (a claim, a reason, a title), or it
#: wants a NUMBER that indexes a numbered store. Both refusals name the verb, show what was
#: typed, and name the command that lists what is available.


def _words(rest: list, at: int, spelling: str, what: str) -> tuple[str, str]:
    """(the words from `at` onward, "") — or ("", the refusal that says what is missing)."""
    said = " ".join(rest[at:]).strip()
    if said:
        return said, ""
    return "", f"{spelling} wants {what}"


def _number(rest: list, at: int, spelling: str, noun: str, lists: str) -> tuple[int, str]:
    """(the number at `at`, "") — or (0, the refusal). One spelling of "that is not a number"."""
    if len(rest) <= at:
        return 0, f"{spelling} wants a {noun} number, e.g. `{spelling} 3`; `{lists}` numbers them"
    try:
        return int(rest[at]), ""
    except ValueError:
        return 0, (f"{spelling} wants a {noun} NUMBER, got {rest[at]!r}; `{lists}` numbers them")


def _retired(verb: str) -> int | None:
    """A command that was removed says what replaced it, or None if it is simply unknown.

    IT FAILS, AND IT TEACHES. Non-zero because the command did not run and a script must
    not read this as success; the replacement in full because the reader is most often an
    agent working from a prompt, a skill or a runbook written against a version still
    installed somewhere — and an agent told only "no such command" retries the spelling,
    which is the one thing that cannot work, and then routes around the journal.
    """
    got = help.retired(verb)
    if not got:
        return None
    why, commands, then = got
    # ONE `say`, BECAUSE `say` MARKS WHAT IT IS GIVEN. It puts `! ` on the first line of
    # every call, so five calls made five refusals out of one — the marker means "this is
    # the refusal", and repeated down a page it means nothing.
    return _refuse("\n\n".join((fmt.wrap(why), fmt.commands(commands), fmt.wrap(then))))


class Opts:
    """Everywhere a flag's value lands. One instance per invocation, built by the loop
    below from FLAGS/BARE_FLAGS, and read by whichever verb handler needs a field —
    most read two or three of these, none read them all.

    NOT A DATACLASS, FOR ONE MEASURED REASON: `import dataclasses` costs 5.9ms and pulls
    `inspect` (4.8ms) in behind it, on EVERY invocation of a CLI whose whole start is
    ~110ms — for a decorator whose only work here is writing an `__init__` that assigns
    thirty defaults. The class body below still reads as the declaration it was; the
    defaults are class attributes, which is what a dataclass would have produced.
    """
    all_of_them: bool = False
    page: int = 1
    acting: str = ""
    from_src: str | None = None
    serve_port: int | None = None
    open_browser: bool = False



class _Flag(NamedTuple):
    """One row of the flag table. `dest` is the Opts field it fills; None means the
    option is recognised and consumed here but read elsewhere (`--env=`, `--from=`).
    `type` converts a `--x=value`'s text — raising ValueError with the refusal to print
    if it cannot. `set` is what a bare flag (no value at all) writes into its dest.
    """
    dest: str | None = None
    type: object = str
    set: object = True


def _int_flag(spelling: str):
    def conv(v: str) -> int:
        try:
            return int(v)
        except ValueError:
            raise ValueError(f"{spelling} wants a number, got {v!r}")
    return conv


def _page_flag(v: str) -> int:
    try:
        return int(v)
    except ValueError:
        raise ValueError("--page wants a number")


# `--x=value` FLAGS. Aliases share one `_Flag` instance, so two spellings cannot drift.
_ENV_NOOP = _Flag(dest=None)      # applied and refused in run(), before any command reads the record

VALUE_FLAGS: dict[str, _Flag] = {
    "--env": _ENV_NOOP, "--environment": _ENV_NOOP, "--track": _ENV_NOOP,
    "--as": _Flag(dest="acting"),
    "--from": _Flag(dest="from_src"),
    "--page": _Flag(dest="page", type=_page_flag),
    "--port": _Flag(dest="serve_port", type=_int_flag("--port")),
}

# BARE FLAGS: no value, presence is the value. `set` is what lands in `dest`; every
# flag not listed writes `True`, so only the two exceptions (`--strike`, `--none`) name
# theirs.
BARE_FLAGS: dict[str, _Flag] = {
    "--none": _Flag(dest="after", set="--none"),    # `todos after <n> --none` clears the prerequisites
    "--all": _Flag(dest="all_of_them"),
    "--open": _Flag(dest="open_browser"),
}


# ─────────────────────────────────── VERB HANDLERS ────────────────────────────────────
# Every handler takes (verb, rest, opts) and returns the exit code — the shape COMMANDS
# below dispatches to. `rest[0] is verb`; a handler slices `rest[1:]`, `rest[2:]` etc.
# for its own sub-words, exactly as the code it replaces did. Nothing here changes what
# any command does — only how main() finds it.

def cmd_cleanup_keep(mark: str) -> int:
    """Say a countable finding was read and kept, so it stops being reported until it grows.

    NOT EVERY FINDING IS A MISTAKE. Most of what `cleanup` lists has a fix beside it — strike
    the claim, remove the environment — and running the fix is how it stops being listed. The
    rows the retired auto-close closed are different: how a row closed is a fact about the
    past, so a reader who audits all of them and finds nothing to reopen has nothing to DO,
    and the line would say the same number forever.

    ONLY A FINDING THAT CARRIES A `mark` IS KEEPABLE, which is what keeps this from becoming a
    mute button for the tier: a mistake is fixed, never kept.
    """
    import cleanup as cleanup_mod
    here = tracks.current(root(), _stem())
    found = [c for c in cleanup_mod.candidates(root(), here) if c.get("mark")]
    hit = next((c for c in found if c["mark"] == mark), None)
    if hit:
        fmt.say(cleanup_mod.keep(root(), here, mark, _now(),
                                 int(str(hit["text"]).split()[0])))
        return 0
    names = ", ".join(f"`{c['mark']}`" for c in found)
    return _refuse(
        (f"nothing is reported as {mark!r} here. " if mark else "keep which finding? ")
        + (f"What can be kept: {names}" if names
           else "Nothing countable is being reported — `journal cleanup` shows what is."))


def _v_cleanup(verb: str, rest: list[str], opts: Opts) -> int:
    # THE NOUN OWNS ITS VERBS (ruling R10/R11): the reading pass is an explicit `read`,
    # never a bare `journal cleanup` that silently means something else.
    if len(rest) > 1 and rest[1] in ("read", "reading"):
        return cmd_cleanup_read()
    if len(rest) > 1 and rest[1] in ("keep", "kept"):
        return cmd_cleanup_keep(rest[2] if len(rest) > 2 else "")
    if len(rest) > 1:
        return _refuse(f"cleanup takes no argument (got {rest[1]!r}) — `journal cleanup` for what a "
                       "check can see, `journal cleanup read` for the half only reading finds, "
                       "`journal cleanup keep <finding>` to mark a countable one read")
    return cmd_cleanup(opts.all_of_them)












def _dispatch(argv: list[str]) -> int:
    parsed, why = commands.REGISTRY.parse(argv)
    return parsed.command.run(parsed) if parsed else _refuse(why)






def _v_upgrade(verb: str, rest: list[str], opts: Opts) -> int:
    ok, msg = update.upgrade(root(), opts.from_src)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def _v_update(verb: str, rest: list[str], opts: Opts) -> int:
    # `journal update` upgrades the journal; a note on the work is `journal work
    # update`. `journal upgrade` never carries this ambiguity, so extra words after it
    # are simply ignored — only the shorter, overloaded spelling is checked.
    if len(rest) > 1:
        return _refuse('journal update upgrades the journal. Progress on the open work is:\n'
              '  journal work update "<what moved>"')
    return _v_upgrade(verb, rest, opts)




def _v_migrate(verb: str, rest: list[str], opts: Opts) -> int:
    if len(rest) > 1 and rest[1] in ("run", "now"):
        out = migrate.run(root()) or ["Nothing pending."]
        fmt.say("\n".join(out))
        return 0
    fmt.say(migrate.report(root()))
    return 0


def _v_verify(verb: str, rest: list[str], opts: Opts) -> int:
    body, ok = verify.render(root())
    fmt.say(body)
    return 0 if ok else 1




def _v_version(verb: str, rest: list[str], opts: Opts) -> int:
    have = update.current(root())
    got = update.check(root(), force=True)
    fmt.say(fmt.title(f"AGENT-JOURNAL {have}"))
    if got.get("version") and update.newer(got["version"], have):
        fmt.say(fmt.wrap(f"{got['version']} is available" + (f": {got['headline']}" if got.get("headline") else "")))
        fmt.say(fmt.commands([("journal upgrade", "pull it, tests first, and print what changed")]))
    elif got.get("version"):
        fmt.say(fmt.wrap("This is the latest."))
    else:
        fmt.say(fmt.wrap("Could not reach the repository to check for a newer one."))
    return 0


# ─────────────────────────────────── COMMAND TABLE ────────────────────────────────────
# Verb (and every spelling of it) -> the function that handles it. A group of aliases is
# ONE key — a tuple of names — not one branch per spelling. `update` and `upgrade` stay separate entries
# because they are NOT the same behaviour (see `_v_update`), the one place a verb here
# earns its own row instead of joining another's.
_ALIASES: dict[tuple[str, ...], object] = {
    ("cleanup", "tidy"): _v_cleanup,
    ("migrate", "migrations"): _v_migrate,
}

COMMANDS: dict[str, object] = {name: fn for names, fn in _ALIASES.items() for name in names}
COMMANDS.update({
    "loop": lambda verb, rest, opts: cmd_loop(rest[1:]),
    "update": _v_update,
    "upgrade": _v_upgrade,
    "verify": _v_verify,
    "settings": lambda verb, rest, opts: cmd_settings(),
    "serve": lambda verb, rest, opts: cmd_serve(opts.serve_port, opts.open_browser),
    "enable": lambda verb, rest, opts: cmd_enable(),
    "disable": lambda verb, rest, opts: cmd_disable(),
    "version": _v_version,
})


def main(argv: list[str]) -> int:
    # BEFORE ANY COMMAND READS THE RECORD. A record written by an older version is migrated
    # by whichever process notices first; this is the one that notices most often. Except
    # for `migrate` itself: a status that has already acted is a status nobody can read.
    if not (argv and argv[0] in ("migrate", "migrations")):
        for line in migrate.ensure(root()):
            print(line, file=sys.stderr)
    # HELP WORKS AFTER ANY VERB, and an unknown option is refused rather than kept as
    # words. `journal todos --help` used to add a to-do titled "--help": help was only
    # recognised as the first word, and anything else starting with `--` fell through
    # into the text. A flag nobody declared is a typo, and a typo filed as a title is a
    # write that reports success and lands wrong.
    if len(argv) >= 3 and argv[0] == "tools" and argv[1] == "run":
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
        return _dispatch(argv)
    # EVERYTHING AFTER A BARE `--` IS PAYLOAD. The loop below matches options by prefix, so
    # a title, a claim, a reminder or a strike reason that opens with `--` was parsed as a
    # flag and never reached the command — and `--env=` is a KNOWN one, so
    # `todos add "--env= is validated twice"` was refused with a message about environments.
    # Refusing an unknown option is right and stays; what was missing is the way every other
    # CLI lets you say the next word is not an option.
    if "--" in argv:
        cut = argv.index("--")
        argv, payload = argv[:cut], argv[cut + 1:]
    else:
        payload = []
    # ONE LOOP OVER THE FLAG TABLE. `--x=value` and bare `--x` are the same shape with
    # different fields (VALUE_FLAGS / BARE_FLAGS), looked up by the token itself — never
    # a chain of `elif a == ...`. Adding a flag means adding a row, never a branch.
    opts = Opts()
    rest: list[str] = []
    for a in argv:
        if a.startswith("--") and "=" in a:
            name, val = a.split("=", 1)
            spec = VALUE_FLAGS.get(name)
            if spec is None:
                return _refuse(f"unknown option {a!r}. `journal help` lists the commands and their options.")
            if spec.dest is not None:
                try:
                    converted = spec.type(val)
                except ValueError as e:
                    return _refuse(str(e))
                setattr(opts, spec.dest, converted)
        elif a.startswith("--") and len(a) > 2:
            spec = BARE_FLAGS.get(a)
            if spec is None:
                return _refuse(f"unknown option {a!r}. `journal help` lists the commands and their options.")
            setattr(opts, spec.dest, spec.set)
        else:
            rest.append(a)
    rest += payload
    verb = rest[0] if rest else ""
    handler = COMMANDS.get(verb)
    if handler is not None:
        return handler(verb, rest, opts)
    if verb:
        gone = _retired(verb)
        if gone is not None:
            return gone
        fmt.say(f"No such command: {verb}\n", error=True)
        fmt.say(__doc__, error=True)
        return 1
    return cmd_status()


def run(argv: list[str]) -> int:
    """One CLI invocation, from scratch, in this process.

    THE MODULE-LEVEL SET-UP IS PART OF A COMMAND, not part of an import: `--env=` is read
    off argv, the environment override is applied, and the process says which environment
    it is on. Running twice in one interpreter therefore has to do that twice, or the
    second command silently inherits the first one's environment.

    It exists for the test harness, which pays the package's 420ms import once per project
    instead of once per check — but it is also the honest shape: everything below `main`
    was always per-invocation, and only the file it lived in said otherwise.
    """
    _state._CACHE.clear()
    tracks.override("")
    flag = next((a.split("=", 1)[1] for a in argv
                 if a.startswith(("--env=", "--environment=", "--track="))
                 and "--" not in argv[:argv.index(a)]), "")
    if flag:
        name = _state.slug(flag) or "default"
        if name not in tracks._all(_ROOT):
            fmt.say(f"no environment is called {name!r}; `journal environments` lists them, "
                    "`journal switch` or `journal prepare` creates one", error=True)
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
