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
import grants
import help
import settings as settings_mod
import commands
import ideas
import questions
import pins
import reminders
import tags
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


import worktree as _wt

import app
from app import BRIEF_REFUSED, CATALOGUE_PAGE, PAGE, project, root
from app import brief as _brief, catalogue as _catalogue, doc_where as _doc_where, now as _now
from app import refuse as _refuse, resolved as _resolved, stem as _stem, where as _where

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



def _load(back: int = 0):
    import digest      # only the transcript commands need it; it pulls tags and the rest
    conf, problems = settings_mod.load(root())
    for p in problems:
        fmt.say(f"{p}", error=True)
    digest.CONTEXT = conf["context_messages"]
    path = _transcript()
    lines, boundaries = transcript.read(path)
    return conf, lines, boundaries, transcript.since(lines, boundaries, back), path


def _transcript() -> Path:
    """The transcript this command is about: this session's, or a labelled guess.

    Every Bash call made from inside a session carries the session id in its environment,
    so the CLI is not blind. It reads the newest file by mtime only for a person at a bare
    terminal, and then it SAYS it guessed — with two terminals open the guess is the other
    one, and a `search` that quietly answered from the wrong conversation is the confident
    falsehood this tool exists to prevent.
    """
    got = _resolved()
    if got is None:
        fmt.say("No transcript for this project yet.", error=True)
        raise SystemExit(1)
    return got[0]


#: The lifecycle verbs `journal environments <verb>` hands to their top-level twins. Reads
#: (`journal environments`, `journal environments show "<name>"`) are not here: they are the
#: noun itself, and a name is not a verb.
ENV_VERBS = ("switch", "claim", "prepare")

#: EVERY SPELLING OF THE NOUN, in ONE list, because it was written out four times and a
#: fifth site would have been the one that forgot an alias. `environments` is canonical
#: (ruling R10); the singular and the short forms are permanent aliases like `pin` and
#: `todo`, and `--env=<name>` already spelled it short, so the noun answers to it too.
ENV_NOUNS = ("environments", "environment", "envs", "env", "tracks", "track")


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


def cmd_read(back: int) -> int:
    conf, lines, boundaries, seg, path = _load(back)
    n = len(boundaries)
    if back > n:
        # SAY IT RATHER THAN CLAMP. `since` shows the oldest stretch for any N past the
        # first compaction; labelling that as "N back" is an index that lies.
        fmt.say(f"  ! only {n} compaction(s) in this session; showing the oldest stretch",
              error=True)
        back = n
    where = "since the last compaction" if back == 0 else f"the stretch {back} summary/ies back replaced"
    fmt.say(fmt.title("CONVERSATION", sub=f"{where} · {len(seg)} lines · {n} compaction(s) in this session"))
    fmt.say()
    import digest
    body = digest.render(seg)
    fmt.say(body if body.strip() else "  (nothing was said in this stretch)")
    if back == 0 and n:
        fmt.say()
        fmt.say(fmt.commands([("journal conversation --back=1", "precisely what the last summary dropped")]))
    return 0


def cmd_user(back: int) -> int:
    _, _, _, seg, _ = _load(back)
    import digest
    body = digest.users_only(seg)
    fmt.say(fmt.title("THE USER'S OWN WORDS", sub="in full, never trimmed"))
    fmt.say(body if body.strip() else "\n  (the user said nothing in this stretch)")
    return 0








#: A LISTING SHOWN BY DEFAULT COSTS CONTEXT EVERY TIME; a search was asked for. So the


def cmd_search(term: str, all_of_them: bool = False, width: int | None = None, page: int = 1) -> int:
    """Every line mentioning the term on this environment, across every session of the project.

    AN ENVIRONMENT HAS A TRANSCRIPT — everything said while it was current, in every session —
    and that is what is searched, because a ruling made on this environment last week is as
    much this environment's as one made an hour ago. `--all` searches every environment. The line
    number is the citation and leads, with the session it belongs to; the passage is a
    window around the first mention, wrapped, with the term marked so the eye lands on it.
    """
    width = fmt.room(width)
    import textwrap
    from pins import age
    conf, problems = settings_mod.load(root())
    for pr in problems:
        fmt.say(f"{pr}", error=True)
    here = tracks.current(root(), _stem())
    needle = term.lower()
    found: list[tuple[Path, list]] = []
    total = 0
    # ONLY THE SESSIONS THAT CARRIED THIS ENVIRONMENT, from the index — plus any session the
    # index has never heard of, read the long way so a session older than the index is
    # not silently missing.
    idx = tracks.carried_by(root())
    known = {stem for stems in idx.values() for stem in stems}
    wanted = set(idx.get(here) or [])
    for path in transcript.sessions(project()):
        if not all_of_them and path.stem in known and path.stem not in wanted:
            continue
        lines, _ = transcript.read(path)
        pool = lines if all_of_them else transcript.on_track(lines, here)
        hits = [l for l in pool if l.spoken and needle in (l.text or "").lower()]
        if hits:
            found.append((path, hits))
            total += len(hits)
    scope = "every environment, every session" if all_of_them else f"environment {here}, every session"
    if not total:
        fmt.say(fmt.title(f"NOTHING MENTIONS {term!r}", sub=scope))
        fmt.say()
        fmt.say(fmt.wrap("The record does not have it. Say so rather than filling the gap."))
        if not all_of_them:
            fmt.say(fmt.commands([(f"journal search {term} --all", "every environment")]))
        return 0
    # A PAGE AT A TIME. A common term in a long environment has hundreds of mentions, and the
    # reader is an agent whose window this lands in. Newest first, because a decision is
    # more likely recent than old, and a page number for the rest.
    pages = max(1, -(-total // PAGE))
    page = min(max(1, page), pages)
    lo, hi = (page - 1) * PAGE, page * PAGE
    sub = scope + (f" · page {page} of {pages}, newest first" if pages > 1 else "")
    fmt.say(fmt.title(f"{total} LINE(S) MENTION {term!r}", sub=sub))
    mine = transcript.session_transcript(project())
    seen = 0
    for path, hits in found:  # sessions are newest first already
        hits = list(reversed(hits))
        take = [l for i, l in enumerate(hits, seen) if lo <= i < hi]
        seen += len(hits)
        if not take:
            continue
        label = "this session" if mine and path == mine[0] else f"session {path.stem[:8]}"
        when = age(take[0].ts) if take[0].ts else ""
        fmt.say(fmt.section(label + (f", {when}" if when else "")))
        for l in take:
            who = "USER" if l.kind == "human" else "agent"
            fmt.say(f"  {l.n:>5}  {who}")
            body = " ".join(tags.strip(l.text).split())
            i = body.lower().find(needle)
            lo, hi = max(0, i - 140), min(len(body), i + len(term) + 200)
            snippet = body[lo:hi]
            j = snippet.lower().find(needle)
            if j >= 0:
                snippet = snippet[:j] + "«" + snippet[j:j + len(term)] + "»" + snippet[j + len(term):]
            snippet = ("…" if lo else "") + snippet + ("…" if hi < len(body) else "")
            fmt.say(textwrap.fill(snippet, width=width, initial_indent="         ",
                                subsequent_indent="         "))
            fmt.say()
    rows = []
    if page < pages:
        rows.append((f"journal search {term} --page={page + 1}", f"the next {min(PAGE, total - hi)} of {total}, older"))
    rows.append(("journal conversation --back=N", "reads a whole stretch of this session"))
    fmt.say(fmt.wrap("A line number is a citation within its session."))
    fmt.say(fmt.commands(rows))
    return 0












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




def cmd_carry(fresh: bool) -> int:
    """THE FULL HANDOVER, on demand. What the doorway points at.

    THE TWO STOPPED BEING THE SAME THING. This printed exactly what the hook injected, which
    made it a way to LOOK at the block — worth a command on its own, because that block is
    assembled inside a hook and delivered into a context the user never reads. Now the hook
    injects a doorway: where you are, what the commands are, how many of each thing stands.
    The rest is here, uncapped, for a session that would rather read it once than run six
    commands.

    NO `--unfold`. A flag would exist only to tell this apart from the injected form, and
    there is nothing to tell apart any more: nobody types the doorway. `carry` means the
    whole handover, and that is its only meaning.
    """
    import hook
    fmt.say(hook.carried("startup" if fresh else "compact", depth=hook.FULL))
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


PREPARE = """\
Preparing {name}: an environment ready to be picked up from A to Z, by you, by another
session. Only when the user asked for it. In order:

  1  the source        the issue, the PR, the user's words — fetch it whole (gh, the tracker's tool, or ask)
  2  the brief         journal docs add "{name}: <title>" --abstract="<one line>" --brief   < the source
                       journal docs attach <doc> <path> "<what it is>"                   designs, screenshots, exports
  3  the plan          a Plan agent: phases and the work in each, from the brief — file it: docs part <doc> "Plan" --brief
  4  the steps         a second agent: concrete steps per phase, what is missing, what could go wrong — docs part <doc> "Steps" --brief
  5  what must hold    journal pins add "<constraint>" --doc=<doc>      the facts every later reader needs; rule if project-wide
  6  the to-dos        one per unit of work, in order, the brief citing the doc:
                       journal todos add "<title>" --brief --doc=<doc>.<p>   < the brief
                       journal todos ask <n> "<question>"                what only the user can answer
                       the last one: verify and close — the definition of done
  7  auto?             ask the user: journal todos auto on   works the list without asking
  8  the page          journal environments "{name}"   — read it as the one who picks this up would

Then offer: work it now (todo start 1), leave it for a session (journal switch "{name}"), or
or leave it for a later session.
"""


def cmd_prepare(name: str) -> int:
    name = _state.slug(name)
    if not name:
        fmt.say('prepare what? journal prepare "<environment>" — letters, digits and dashes', error=True)
        return 1
    stem = _stem() or ""
    conf, _ = settings_mod.load(root())
    ok, msg = tracks.switch(root(), name, _now(), stem, project=not stem,
                            exclusive=conf["one_session_per_environment"], stale_hours=conf["session_stale_hours"])
    if not ok and "already on" not in msg:
        fmt.say(msg, error=True)
        return 1
    fmt.say(fmt.title("PREPARE", sub=name))
    fmt.say("")
    fmt.say(PREPARE.format(name=name))
    return 0


def cmd_tracks(name: str = "") -> int:
    conf, _ = settings_mod.load(root())
    if name:
        ok, msg = tracks.page(root(), name, commands=True)
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    rows = tracks.listing(root(), _stem(), conf["session_stale_hours"])
    fmt.say(fmt.title("ENVIRONMENTS", sub="* this session · > where new sessions start"))
    fmt.say()
    wide = max([len(t["name"]) for t in rows] + [12])   # measured, not a hardcoded 28
    for t in rows:
        mark = ("*" if t["current"] else " ") + (">" if t["start"] else " ")
        who = ("   sessions: " + ", ".join(f"{sid[:8]} ({t['seen'].get(sid, '')})" for sid in t["sessions"])) if t["sessions"] else ""
        fmt.say(f" {mark} {t['name']:<{wide}} {t['pins']} pin(s), {t['open']} open{who}")
    fmt.say()
    # THE SHAPE EVERY OTHER CATALOGUE HAS: the sentence that says what this store is, a
    # blank line, then the commands. This screen had them the other way round and with no
    # blank between, so its closing prose read as a continuation of the last command.
    fmt.say(fmt.wrap("Nothing is ever closed by switching." + (
        " One running session works an environment at a time; a stale session is one not seen for "
        f"{conf['session_stale_hours']:g} h." if conf["one_session_per_environment"] else "")))
    fmt.say(fmt.commands([
        ('journal switch "<name>"', "this session onto that environment (from a terminal: the project's start environment)"),
        ('journal switch "<name>" --project', "this session, and where new sessions start"),
        ('journal switch "<name>" --session=<id>', "move one bound session; --all-sessions moves every one"),
        ("journal switch --back", "the one you came from"),
        ('journal environments remove "<name>"', "take one off the list — it says what it holds, --yes does it"),
    ]))
    return 0


def cmd_switch(name: str, go_back: bool, project_too: bool = False, sessions: list[str] | None = None,
               all_sessions: bool = False) -> int:
    stem = _stem() or ""
    conf, _ = settings_mod.load(root())
    excl, stale = conf["one_session_per_environment"], conf["session_stale_hours"]
    if all_sessions or sessions:
        ok, msg = tracks.switch(root(), name, _now(), "", project=True) if not go_back else (False, "--back takes no sessions")
        if not ok and "already on" not in msg:
            fmt.say(f"{msg}", error=True)
            return 1
        moved, refused = tracks.move_sessions(root(), name, None if all_sessions else sessions, excl, stale)
        fmt.say(f"the project starts on {name}; moved {len(moved)} session(s): " + ", ".join(m[:8] for m in moved))
        if refused:
            fmt.say("  ! not moved, one running session works an environment: " + ", ".join(r[:8] for r in refused), error=True)
            return 1
        return 0
    ok, msg = (tracks.back(root(), _now(), stem, excl, stale) if go_back
               else tracks.switch(root(), name, _now(), stem, project=project_too or not stem, exclusive=excl, stale_hours=stale))
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


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


def cmd_track_remove(name: str, yes: bool) -> int:
    conf, _ = settings_mod.load(root())
    ok, msg = tracks.remove(root(), name, _now(), _stem() or "", yes=yes,
                            stale_hours=conf["session_stale_hours"])
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_claim(name: str, why: str) -> int:
    """Take an environment a live session still holds. The holder is unbound and told."""
    conf, _ = settings_mod.load(root())
    ok, msg = tracks.claim(root(), name, _now(), _stem() or "", why,
                           stale_hours=conf["session_stale_hours"])
    fmt.say(msg, error=not ok)
    return 0 if ok else 1




def cmd_lent() -> int:
    """`journal lent` — a dispatched agent asking what it has been given.

    THE CHECK-IN THAT `grant` IS ON THE PARENT'S SIDE. An agent used to learn its own name
    as a side effect: it ran whatever tool it ran first, and the hook attached the briefing
    to that tool's result. It worked, but the moment was an accident of whatever the agent
    happened to do, and nothing initialised anything on purpose.

    THE CLI CANNOT ANSWER THIS AND SAYS SO PLAINLY. `agent_id` reaches the hook and never
    the process — that is the identity collision this whole mechanism exists for, and it
    does not stop applying to the command that asks about it. So the CLI half prints what a
    SESSION should hear, and the hook half answers an agent on the tool's result, where
    `agent_id` exists. One command, two readers, and the one who cannot be told here is told
    a line later.
    """
    stem = _stem()
    lent = grants.granted(root(), stem)
    fmt.say(fmt.Out(
        title="LENT", sub=f"{len(lent)} environment(s) this session has lent",
        lead="You are a SESSION, not a dispatched agent — nothing lent this to you, and the "
             "journal is yours. `journal lent` is the command an agent you dispatch runs to "
             "learn its own name and its environment; put it first in the prompt you give it."
             if not _stem_is_agent() else "",
        items=tuple(fmt.Item(title=n, text="its agents write here with --env and --as")
                    for n in lent) or (fmt.Item(text="This session has lent nothing."),),
        footer='`journal grant "<environment>"` lends one and prints the sentence to paste '
               "into the dispatch.".strip()))
    return 0


def _stem_is_agent() -> bool:
    """Is this process a dispatched agent's? It cannot be, and that is the point.

    `agent_id` lives in the hook's payload and nowhere in the environment a subagent's shell
    inherits — measured, and the reason `--as=` has to be typed at all. Kept as a named
    function rather than a bare `False` because the question is asked here on purpose: if a
    future harness ever puts an agent id in the process, this is the one place that changes.
    """
    return False


def cmd_grant(name: str, off: bool, listing: bool) -> int:
    """`journal grant "<env>"` — lend an environment to this session's subagents.

    THE SESSION DOES NOT MOVE. That is the difference from `prepare`, which creates AND
    switches, and from the deleted `delegate`, which bound the session so that its
    subagents' writes landed there by accident of sharing an id. This lends, and says so
    out loud in a sentence the dispatcher is meant to paste into the prompt.

    BARE, IT LENDS THE ENVIRONMENT YOU ARE ON, because that is the ordinary case and it was
    the one thing this command could not do. The user's ruling: a dispatched agent works its
    dispatcher's environment, with its own ledger under it — a worktree changes where the
    files are and never which environment anyone is on. Requiring a name made the unusual
    case (a separate line of work for the agent) the only case, and this session lent three
    brand-new environments to three agents that afternoon because naming one was the only
    way to lend anything.

    `--list` IS THE LISTING NOW, and `journal grants` still is: the bare form had to give up
    one of its two meanings, and "show me what I lent" is the one a reader can ask for by
    another name.
    """
    stem = _stem()
    if listing:
        lent = grants.granted(root(), stem)
        fmt.say(fmt.Out(
            title="GRANTED", sub=f"{len(lent)} lent by this session",
            lead="" if lent else
                 "This session has lent nothing. A subagent's journal writes are refused.",
            items=tuple(fmt.Item(title=n, text="its subagents may write there with --env")
                        for n in lent),
            footer='`journal grant` lends the environment you are on; `journal grant '
                   '"<other>"` lends a different one, and `--off` takes one back. '
                   "A grant belongs to this session and dies with it."))
        return 0
    if not name and not off:
        name = tracks.current(root(), stem)
    if off:
        ok, msg = grants.revoke(root(), stem or "", name)
    else:
        ok, msg = grants.grant(root(), stem or "", name)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


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
    defaults are class attributes, which is what a dataclass would have produced, and the
    two fields that need a fresh container per instance say so in `__init__` because a
    mutable class attribute is shared by every instance.
    """
    back: int = 0
    all_of_them: bool = False
    go_back: bool = False
    fresh: bool = False
    off_flag: bool = False
    list_flag: bool = False
    project_too: bool = False
    all_sessions: bool = False
    yes_flag: bool = False
    sessions: list
    page: int = 1
    acting: str = ""
    to_agent: str = ""
    from_src: str | None = None
    serve_port: int | None = None
    open_browser: bool = False

    def __init__(self):
        # the one field that must not be shared: a list class attribute would be one list for every instance
        self.sessions = []


class _Flag(NamedTuple):
    """One row of the flag table. `dest` is the Opts field it fills; None means the
    option is recognised and consumed here but read elsewhere (`--env=`, `--from=`).
    `type` converts a `--x=value`'s text — raising ValueError with the refusal to print
    if it cannot. `append` makes the value land in a list that grows instead of a plain
    assignment. `set` is what a bare flag (no value at all) writes into its dest.
    """
    dest: str | None = None
    type: object = str
    append: bool = False
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
    "--back": _Flag(dest="back", type=_int_flag("--back")),
    "--env": _ENV_NOOP, "--environment": _ENV_NOOP, "--track": _ENV_NOOP,
    "--session": _Flag(dest="sessions", append=True),
    "--as": _Flag(dest="acting"),
    "--to": _Flag(dest="to_agent"),
    "--from": _Flag(dest="from_src"),
    "--page": _Flag(dest="page", type=_page_flag),
    "--port": _Flag(dest="serve_port", type=_int_flag("--port")),
}

# BARE FLAGS: no value, presence is the value. `set` is what lands in `dest`; every
# flag not listed writes `True`, so only the two exceptions (`--strike`, `--none`) name
# theirs.
BARE_FLAGS: dict[str, _Flag] = {
    "--off": _Flag(dest="off_flag"),
    #: `grant` LENDS BARE now, so its listing needed a spelling of its own — `_v_grant`.
    "--list": _Flag(dest="list_flag"),
    "--project": _Flag(dest="project_too"),
    "--yes": _Flag(dest="yes_flag"),
    "--all-sessions": _Flag(dest="all_sessions"),
    "--none": _Flag(dest="after", set="--none"),    # `todos after <n> --none` clears the prerequisites
    "--fresh": _Flag(dest="fresh"),
    "--back": _Flag(dest="go_back"),
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


def _v_assign(verb: str, rest: list[str], opts: Opts) -> int:
    n, why = _number(rest, 1, "assign", "to-do", "journal todos")
    if why:
        return _refuse(why)
    who = opts.to_agent or " ".join(x for x in rest[2:] if not x.startswith("--"))
    off = opts.off_flag or "--off" in rest
    if not who and not off:
        return _refuse(f'assign wants an agent: `journal assign {n} --to="<agent>"`, '
                       f"or `journal assign {n} --off` to put it back on the list")
    here = tracks.current(root(), _stem())
    ok, msg = todo.assign(root(), here, n, "--off" if off else who)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def _v_grant(verb: str, rest: list[str], opts: Opts) -> int:
    # `grants` IS THE LISTING SPELLING, and so is `--list`. Bare `grant` lends the
    # environment this session is on; the plural noun reads as a question about what stands,
    # which is exactly what it now answers.
    listing = opts.list_flag or verb == "grants"
    return cmd_grant(" ".join(x for x in rest[1:] if x not in ("--off", "--list")),
                     opts.off_flag or "--off" in rest, listing)


def _v_search(verb: str, rest: list[str], opts: Opts) -> int:
    if len(rest) < 2:
        return _refuse("search wants a term")
    return cmd_search(" ".join(rest[1:]), opts.all_of_them, page=opts.page)




def _v_environments(verb: str, rest: list[str], opts: Opts) -> int:
    # `show` AND `list` STAY UNDER THE NOUN: there is no `journal show`. An environment
    # can be named anything, `switch` and `claim` included, so `journal environments
    # show "claim"` is how its page is read. `remove` lives only under the noun too,
    # like `show` — a bare verb that deletes is the one spelling a mistyped name must
    # never reach.
    if len(rest) > 1 and rest[1] in ("show", "read"):
        if len(rest) < 3:
            return _refuse('environments show wants a name: journal environments show "<name>"')
        return cmd_tracks(" ".join(rest[2:]))
    if len(rest) == 2 and rest[1] == "list":
        return cmd_tracks("")
    if len(rest) > 1 and rest[1] in ("remove", "rm", "delete", "forget"):
        if len(rest) < 3:
            return _refuse('remove wants a name: journal environments remove "<name>"')
        return cmd_track_remove(" ".join(rest[2:]), opts.yes_flag)
    return cmd_tracks(" ".join(rest[1:]))




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


def _v_worktree(verb: str, rest: list[str], opts: Opts) -> int:
    if len(rest) > 1 and rest[1] == "link":
        ok, msg = _wt.link(Path(__file__).parent if Path(__file__).parent.is_symlink()
                           else Path(__file__).resolve().parent)
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    main_root = _wt.main_root(project())
    fmt.say(f"a linked worktree of {main_root}; .journal " + ("is a symlink to its journal" if (project() / ".journal").is_symlink() else "is a COPY — `journal worktree link` fixes that")
          if main_root else "not a linked worktree")
    return 0


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
# ONE key — a tuple of names — so `journal env`, `envs`, `environment`, `tracks`,
# `track` are one entry with five names, not five branches; ENV_NOUNS is that tuple
# already, reused rather than retyped. `update` and `upgrade` stay separate entries
# because they are NOT the same behaviour (see `_v_update`), the one place a verb here
# earns its own row instead of joining another's.
_ALIASES: dict[tuple[str, ...], object] = {
    ("cleanup", "tidy"): _v_cleanup,
    ("grant", "grants"): _v_grant,
    ("lent",): lambda verb, rest, opts: cmd_lent(),
    ("migrate", "migrations"): _v_migrate,
    ENV_NOUNS: _v_environments,
}

COMMANDS: dict[str, object] = {name: fn for names, fn in _ALIASES.items() for name in names}
COMMANDS.update({
    "assign": _v_assign,
    "user": lambda verb, rest, opts: cmd_user(opts.back),
    "search": _v_search,
    "carry": lambda verb, rest, opts: cmd_carry(opts.fresh),
    "claim": lambda verb, rest, opts: cmd_claim(rest[1] if len(rest) > 1 else "", " ".join(rest[2:])),
    "prepare": lambda verb, rest, opts: cmd_prepare(" ".join(rest[1:])),
    "loop": lambda verb, rest, opts: cmd_loop(rest[1:]),
    "switch": lambda verb, rest, opts: cmd_switch(" ".join(rest[1:]), opts.go_back, opts.project_too, opts.sessions or None, opts.all_sessions),
    "update": _v_update,
    "upgrade": _v_upgrade,
    "verify": _v_verify,
    "settings": lambda verb, rest, opts: cmd_settings(),
    "worktree": _v_worktree,
    "serve": lambda verb, rest, opts: cmd_serve(opts.serve_port, opts.open_browser),
    "enable": lambda verb, rest, opts: cmd_enable(),
    "disable": lambda verb, rest, opts: cmd_disable(),
    "version": _v_version,
    "conversation": lambda verb, rest, opts: cmd_read(opts.back),
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
    if commands.REGISTRY.knows(next((a for a in argv if not a.startswith("--")), "")):
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
                if spec.append:
                    getattr(opts, spec.dest).append(converted)
                else:
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
    # THE NOUN OWNS ITS VERBS, and `environments` is a noun like every other. Ruling R11
    # keeps switch, claim and prepare as TOP-LEVEL verbs, because they are burned into
    # hook.py and into what every session is handed at its start — but top-level was
    # never meant to be the ONLY spelling. This rewrite has to happen before the command
    # table is consulted: it is what turns `environments switch "x"` into `switch "x"`
    # so the same handler runs whichever spelling was typed.
    if verb in ENV_NOUNS and len(rest) > 1 and rest[1] in ENV_VERBS:
        rest = rest[1:]
        verb = rest[0]
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
    # `journal --back=1` alone still reads: the block and the skill said it for a day,
    # and a reader with the old words in mind must not land on a status page instead.
    return cmd_read(opts.back) if any(a.startswith("--back") for a in argv) else cmd_status()


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
