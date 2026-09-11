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
    todos          delayed work, parked with the brief you will need in a week
    docs           what was settled: findings, reports, the reasoning a pin cites
    tools          scripts kept for repeated work
    environments   where work lives: switch, prepare, claim, worktree
    cleanup        what has evidence against it: stale rules, pins, docs, empty environments
    transcript     read it back: conversation, user, search, carry
    system         verify, version, update, settings, loop

THE PLURAL NOUN IS THE CANONICAL SPELLING (ruling R10). Every singular and legacy one —
`pin`, `rule`, `todo`, `remember`, `tracks`, bare `strike` and `promote` — still runs, still
answers `help`, and calls the very same function. None of them is deprecated.
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
import builtin
import ideas
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

_ROOT, _WT_NOTE = _wt.resolve(Path(__file__).parent if Path(__file__).parent.is_symlink()
                              else Path(__file__).resolve().parent)
if _WT_NOTE:
    fmt.say(f"  {_WT_NOTE}", error=True)


fmt.cli(_ROOT)   # the spelling every printed command uses, from here


def root() -> Path:
    return _ROOT


def project() -> Path:
    # the PROJECT is where this script lives, even when the record is the main checkout's:
    # transcripts, docs and to-dos paths are relative to it; a worktree's transcript is its own
    here = Path(__file__).parent
    return (here if here.is_symlink() else Path(__file__).resolve().parent).parent


def _stem() -> str | None:
    got = transcript.session_transcript(project())
    return got[0].stem if got and not got[1] else None


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


def _resolved() -> tuple[Path, bool] | None:
    got = transcript.session_transcript(project())
    if got and got[1]:
        fmt.say(f"  (guessed: newest transcript, {got[0].name} — {transcript.SESSION_ENV} is "
              "not set)", error=True)
    return got


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
    rows.append(("hooks", "fired in this session" if mine else "nothing has reached the hook in this session",
                 "journal verify"))
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


def cmd_open() -> int:
    standing = work.open_work(root())
    if not standing:
        fmt.say("Nothing is open.")
        return 0
    fmt.say(fmt.title("OPEN WORK", sub="declared and never closed"))
    for w in standing:
        fmt.say()
        fmt.say(f"  {w['subject']}")
        fmt.say(f"     {fmt.dim('since ' + w['at'][:16].replace('T', ' '))}")
        # THE NOTES ARE THE POINT OF `open`, not decoration. A subject alone says a thing
        # is in flight; the notes say where it got to, which is what a reader on the far
        # side of a compaction actually needs before they touch it.
        for note in w.get("notes", []):
            fmt.say(fmt.wrap(f"{note['at'][11:16]}  {note['text']}", indent=5))
    fmt.say()
    fmt.say(fmt.commands([
        ('journal work end "<the same words>"', "close it"),
        ('journal work update "<where it got to>"', "say where it got to"),
    ]))
    return 0


def _now() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


BRIEF_WAIT = 10.0
BRIEF_REFUSED = ("--brief takes the brief on stdin and nothing arrived. Pipe it in — "
                 "journal <command> --brief <<'MSG' … MSG — or drop --brief and pass the "
                 "title alone.")


def _brief(brief: bool) -> str | None:
    """The body behind --brief, or None when the caller must be refused.

    BOUNDED, for the same reason the record lock is: `sys.stdin.read()` runs to EOF, and an
    agent's shell hands the command a stdin nobody ever closes. The flag then hangs until
    the tool times out, saying nothing — the worst failure the CLI has, because it looks
    like the journal is thinking. Wait a few seconds, then refuse with the spelling that
    works. An empty read is refused too: a to-do or a part with a blank brief is the same
    mistake, filed instead of caught.
    """
    if not brief:
        return ""
    if sys.stdin is None or sys.stdin.closed or sys.stdin.isatty():
        return None
    try:
        import select
        import time as _time
        fd = sys.stdin.fileno()
    except (ImportError, OSError, ValueError):  # not POSIX, or stdin has no fd: as before
        return sys.stdin.read() or None
    chunks: list[bytes] = []
    deadline = _time.monotonic() + BRIEF_WAIT
    while True:
        left = deadline - _time.monotonic()
        if left <= 0:
            if not b"".join(chunks).strip():
                return None
            print(f"journal: stdin never closed — took the {len(b''.join(chunks))} character(s) "
                  f"that arrived in {BRIEF_WAIT:.0f}s", file=sys.stderr)
            break
        if not select.select([fd], [], [], min(left, 0.1))[0]:
            continue
        blob = os.read(fd, 65536)
        if not blob:
            break
        chunks.append(blob)
    text = b"".join(chunks).decode("utf-8", "replace")
    return text if text.strip() else None


def cmd_await(what: str, on: str | None, minutes: float | None,
              agent: str | None = None, pid: int | None = None) -> int:
    """Mark the open work as waiting on something, with a deadline."""
    import time as _time
    conf, _ = settings_mod.load(root())
    mins = minutes if minutes is not None else conf["await_default_minutes"]
    cap = conf["await_max_minutes"]
    if mins > cap:
        fmt.say(f"a wait is capped at {cap} minute(s) — nothing waits longer without saying so again",
                error=True)
        mins = cap
    ok, said = work.wait(root(), what, mins, _now(), _time.time(), on, agent, pid)
    fmt.say(said, error=not ok)
    return 0 if ok else 1


def cmd_start(subject: str) -> int:
    ok, msg = work.start(root(), subject, _now(), _where())
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_end(subject: str, force: bool = False, acting: str = "",
            close_todo: bool = False) -> int:
    """Close the work, and ask the one question that is only answerable now.

    THE MOMENT WORK CLOSES IS THE MOMENT YOU KNOW WHAT IT TAUGHT. Before it, you cannot
    say; long after, you no longer remember there was anything to say. Pins were coming out
    sparse — three in a full day of work — and the only prompt to write one fired at 75%
    context, which is late and is about the compaction rather than about the work.

    It ASKS, it does not hold. A gate here would be a third rule, and this is a question
    with a legitimate answer of "nothing" — most work teaches nothing that outlives it.
    """
    ok, msg = work.end(root(), subject, _now(), force)
    fmt.say(msg, error=not ok)
    if ok:
        here = tracks.current(root(), _stem())
        # CLOSING A TO-DO IS ALWAYS EXPLICIT — the user's ruling, after 710 of one project's
        # 1,810 closed rows turned out to have been closed by a `work end` matching a title
        # rather than by anyone deciding they were done. `work end` meant both "finished" and
        # "I am putting this down", and an agent interrupted mid-row does the tidy thing:
        # closes its declaration before switching. The record heard "done". So the match is
        # REPORTED and the close is asked for.
        row = todo.titled(root(), here, subject)
        if row and close_todo:
            closed, note = todo.close_titled(root(), here, subject, _now(), acting)
            fmt.say(f"  to-do {closed} is done with it." if closed else "  " + note)
        elif row:
            fmt.say(f'  to-do {row["n"]} has this title and STAYS OPEN — ending work is not '
                    "finishing a row:\n"
                    f'    journal todos done {row["n"]} "<how>"   it is finished\n'
                    f'    journal work end "<the same words>" --todo   both, in one command')
        # AND THE OTHER DIRECTION, which this asked for two years of sessions and never once.
        # A field report named the gap: "pins go stale precisely when a stretch of work
        # changes the code they describe. Pin 1 was written before the fix and was false the
        # instant the fix landed — about eight hours before anyone noticed." The moment work
        # closes is the moment you know what it taught AND what it just made untrue, and only
        # the first half was ever asked. It asks; a gate here would be a third rule.
        fmt.say('  did that teach anything a later reader would get wrong without?\n'
              '    journal pins add "<the claim, in one line>"   (or nothing, which is fine)')
        standing = len(pins.live(root(), pins.RULES)) + len(pins.live(root()))
        if standing:
            fmt.say(f'  and did it make any of the {standing} standing claim(s) FALSE? work that '
                    "changes code\n    is what makes a pin describe a version that is gone:\n"
                    '    journal pins strike <n> "<why>"   ·   journal rules strike <n> "<why>"')
    return 0 if ok else 1


def cmd_update(text: str, on: str | None) -> int:
    ok, msg = work.note(root(), text, _now(), on)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


PAGE = 25
#: A LISTING SHOWN BY DEFAULT COSTS CONTEXT EVERY TIME; a search was asked for. So the
#: catalogues (`journal docs`, `journal tools`, `journal todo`, `journal pins`, `journal
#: rules`) page at a smaller size than `search`'s 25 — ruling R7, applying the cap
#: `docs.carry`/`tools.carry` already had to the five renderers that never got one.
CATALOGUE_PAGE = 15


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


def _where() -> dict:
    """The transcript position this pin is being written at, so it can be read around later.

    Recorded at WRITE time and never recomputed: the newest session changes, and a pin that
    silently re-points at a different conversation is an index that lies.
    """
    got = _resolved()
    if got is None:
        return {}
    path, guessed = got
    lines, _ = transcript.read(path)
    where = {"line": lines[-1].n if lines else 0, "session": path.name}
    if guessed:
        where["guessed"] = True  # so `pins <n> --full` can say the citation may be off
    return where


def _doc_where(doc_ref: str) -> dict | None:
    """The provenance for a new entry, with the doc it cites — or None if the citation is bad."""
    where = _where()
    if doc_ref:
        err = docs.check_ref(root(), doc_ref)
        if err:
            fmt.say(f"--doc: {err}", error=True)
            return None
        base, head, _ = docs.anchor(root(), doc_ref)
        doc, prt, _ = docs.get(root(), base)
        # A NAME RESOLVES ONCE AND THE NUMBER STAYS — and so does the heading's slug, which
        # is what makes the citation survive the doc being renamed.
        doc_ref = f"{doc['n']}.{prt['p']}" if prt else str(doc["n"])
        if head:
            doc_ref += "#" + docs.slug_of(head)
        where["doc"] = doc_ref
    return where


def cmd_remember(fact: str, supersedes: int | None, doc_ref: str = "", long: str = "") -> int:
    conf, _ = settings_mod.load(root())
    where = _doc_where(doc_ref)
    if where is None:
        return 1
    ok, msg = pins.add(root(), fact, _now(), conf["pin_max_chars"], supersedes, where, long=long)
    fmt.say(msg, error=not ok)
    if ok:
        _decided("pinned")
    return 0 if ok else 1


def _decided(how: str) -> bool:
    """Lift the gate a context rung lowered. True if one was standing."""
    import state
    stem = _stem()
    due = state.get(root(), "pin_due", None, stem=stem) if stem else None
    if not due:
        return False
    state.put(root(), "pin_due", None, stem=stem)
    state.put(root(), "pin_decided", {**due, "how": how, "at": _now()}, stem=stem)
    return True


def cmd_nothing(why: str) -> int:
    """Decline to pin, on the record. The way through the rung gate that is not a pin.

    IT WANTS A REASON, and the reason is the whole point: it is the thought the gate
    exists to force, and it lands in the transcript where a later reader can argue with
    it. A bare "nothing" would be the nudge being clicked through, which is what the gate
    replaced.
    """
    why = " ".join((why or "").split())
    if not why:
        fmt.say('nothing wants a reason: journal nothing "<why nothing here needs pinning>"',
              error=True)
        return 1
    if _decided("declined: " + why):
        fmt.say(f"noted — nothing pinned at this rung, because: {why}")
        return 0
    if not _stem():
        fmt.say("this process cannot tell which session it is — no transcript for "
                f"{transcript.SESSION_ENV} was found — so the decision was NOT filed. Run it from "
                "inside the session, or `journal verify` to see what the hook sees", error=True)
        return 1
    fmt.say("no pin is due — no context warning is waiting on a decision", error=True)
    return 1


def cmd_body(key: str, verb: str, rest: list[str], brief: bool) -> int:
    """`<noun> amend <n> "<section>" --brief` and `<noun> replace <n> --brief`.

    The same two verbs a to-do's brief already takes, over the same shape: one is additive
    and one is not, and what is replaced is kept under `struck/` either way.
    """
    if not rest or not rest[0].isdigit():
        fmt.say(f'{key} {verb} wants a number: journal {key} {verb} 3'
                + (' "<section title>" --brief' if verb == "amend" else " --brief"), error=True)
        return 1
    n = int(rest[0])
    text = _brief(brief)
    if text is None:
        fmt.say(BRIEF_REFUSED, error=True)
        return 1
    if verb == "amend":
        ok, msg = pins.amend_body(root(), n, " ".join(rest[1:]), text, key, _now())
    else:
        ok, msg = pins.write_body(root(), n, text, key, _now())
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_rule(fact: str, strike_n: int | None, why: str, doc_ref: str = "", long: str = "") -> int:
    conf, _ = settings_mod.load(root())
    if strike_n is not None:
        ok, msg = pins.strike(root(), strike_n, why, key=pins.RULES)
    else:
        where = _doc_where(doc_ref)
        if where is None:
            return 1
        ok, msg = pins.add(root(), fact, _now(), conf["pin_max_chars"], None, where,
                           key=pins.RULES, long=long)
        if ok:
            _decided("ruled")
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_rules(all_of_them: bool, n: int | None, full: bool, page: int = 1,
              order: str = fmt.DESC) -> int:
    if n is not None and full:
        conf, _ = settings_mod.load(root())
        ok, body = pins.around(root(), n, project(), conf["pin_context"], key=pins.RULES)
        fmt.say(body, error=not ok)
        return 0 if ok else 1
    live = len(pins.live(root(), pins.RULES))
    struck = len(pins._all(root(), pins.RULES)) - live
    sub = f"{live} in force, on every environment" + (
        f" · {struck} struck" + ("" if all_of_them else " (--all shows them)") if struck else "")
    fmt.say(fmt.title("RULES OF THIS PROJECT", sub=sub))
    fmt.say()
    fmt.say(pins.render(root(), all_of_them=all_of_them, key=pins.RULES, cap=CATALOGUE_PAGE, page=page, order=order))
    # THE PACKAGE'S OWN, MARKED AS ITS OWN. A reader must be able to tell "this project
    # decided" from "the tool ships this": a rule whose provenance is unclear is one nobody
    # can find the argument for, and the argument for these is in `builtin.py`.
    conf, _ = settings_mod.load(root())
    if conf["builtin_rules"] and builtin.RULES:
        fmt.say()
        fmt.say(fmt.dim(f"  THE JOURNAL'S OWN — {len(builtin.RULES)}, in every project that installs it"))
        for r in builtin.RULES:
            fmt.say(fmt.numbered(r["id"], r["fact"]).replace(f"  {r['id']}", f"  {r['id']}", 1))
        fmt.say(fmt.dim("       they cannot be struck; `journal rules show B1` reads the reasoning"))
    fmt.say()
    fmt.say(fmt.wrap("Handed to every session, before anything else."))
    fmt.say(fmt.commands([
        ("journal rules <n> --full", "the conversation around one"),
        ('journal rules strike <n> "<why>"', "repeal one"),
    ]))
    return 0


def cmd_claim_page(n: int, key: str) -> int:
    """`rules show <n>` / `pins show <n>` — the CLAIM, not the conversation around it.

    THE ONE PLACE `show` DID NOT READ ITS NOUN. `docs show 4` prints the doc and `todos show
    3` prints the to-do; this printed a stretch of transcript, which is what `--full` means
    everywhere else. With a long form there is something to read here, so `show` now reads
    it and `<n> --full` still opens the conversation.
    """
    items = pins._all(root(), key)
    noun = "rule" if key == pins.RULES else "pin"
    if n < 1 or n > len(items):
        fmt.say(f"there is no {noun} {n}. `journal {key}` numbers them.", error=True)
        return 1
    it = items[n - 1]
    fmt.say(fmt.title(f"{noun.upper()} {n}", sub=pins.age(it.get("at", ""))))
    fmt.say()
    fmt.say(fmt.wrap(it["fact"]))
    if it.get("struck"):
        fmt.say()
        fmt.say(fmt.wrap(f"STRUCK: {it['struck']}"))
    if it.get("doc"):
        fmt.say()
        fmt.say("  → " + docs.ref_label(root(), str(it["doc"])))
    long = pins.body(root(), n, key)
    fmt.say()
    if long.strip():
        fmt.say(long.rstrip())
    else:
        fmt.say(fmt.wrap("No reasoning is written down. The claim is all there is, which is "
                         "fine — and if the argument matters, this is where it goes."))
    fmt.say()
    fmt.say(fmt.commands([
        (f"journal {key} {n} --full", "the conversation it was written in"),
        (f'journal {key} amend {n} "<section title>" --brief', "add a section to the reasoning"),
        (f"journal {key} replace {n} --brief", "replace the reasoning outright"),
    ]))
    return 0


def cmd_promote(n: int) -> int:
    ok, msg = pins.promote(root(), n, _now(), _where())
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_todo(rest: list[str], all_of_them: bool, brief: bool = False, doc_ref: str = "", after: str = "", acting: str = "", page: int = 1,
             order: str = fmt.DESC, quiet: bool = False) -> int:
    here = tracks.current(root(), _stem())
    # NOUN+VERB ALIASES (ruling R1): `list` and `show <n>` are the canonical spellings of
    # what a bare noun and a bare noun+id already do; stripping them here means the
    # existing bare-shape code below is the ONLY place either behaviour lives.
    if rest and rest[0] == "list":
        rest = rest[1:]
    if rest and rest[0] == "show":
        # A VERB WITH ITS ARGUMENT MISSING IS AN ERROR, NEVER A PAYLOAD. `journal todos show`
        # with no number fell through this check and was read as a TITLE: it filed a to-do
        # called "show" and reported success. A write that lands wrong while saying it went
        # right is the one shape this package exists to prevent, and it is the same defect
        # as a tool named `add` — the noun's vocabulary and its payload sharing one slot.
        if len(rest) > 1 and rest[1].isdigit():
            rest = rest[1:]
        else:
            fmt.say("todos show wants a to-do number: journal todos show 3"
                    + (f", got {rest[1]!r}" if len(rest) > 1 else ""), error=True)
            return 1
    if not rest:
        waiting = todo.open_items(root(), here)
        done = len(todo._all(root(), here)) - len(waiting)
        draining = todo.auto(root(), here)
        sub = f"environment {here} · {len(waiting)} waiting" + (
            f" · {done} done" + ("" if all_of_them else " (--all shows them)") if done else "") + (
            " · auto ON" if draining else "")
        fmt.say(fmt.title("TO-DO", sub=sub))
        fmt.say()
        fmt.say(todo.render(root(), here, all_of_them=all_of_them, cap=CATALOGUE_PAGE, page=page, order=order))
        fmt.say()
        fmt.say(fmt.wrap("Auto is on: with nothing open, the agent picks up the next one on its own."
                       if draining else
                       "Delayed work on this environment, listed at every session start. Not an "
                       "instruction to start one."))
        fmt.say(fmt.commands([
            ("journal todos <n>", "the brief, and the question if it waits on the user"),
            ("journal todos start <n>", "pick one up"),
            ('journal todos add "<title>" --brief', "add one, with a brief on stdin"),
            ('journal todos answer <n> "<answer>"', "answer one that waits on you"),
            ("journal todos auto " + ("off" if draining else "on"),
             "stop working through the list on your own" if draining else "work through the list without asking"),
        ]))
        return 0
    verb = rest[0]
    if verb == "auto":
        if len(rest) < 2:
            fmt.say(f"auto is {'ON' if todo.auto(root(), here) else 'OFF'} for `{here}`. "
                  "`journal todos auto on|off` sets it.")
            return 0
        want = rest[1].lower()
        if want not in ("on", "off", "true", "false", "yes", "no"):
            fmt.say(f"auto wants on or off, got {rest[1]!r}", error=True)
            return 1
        on = want in ("on", "true", "yes")
        fmt.say(todo.set_auto(root(), here, on))
        standing = work.open_work(root())
        # WHAT IS NEXT IS ONE QUESTION WITH ONE ANSWER: `todo.ready`. This asked
        # `open_items` and named its first row, while the stop hook it was predicting asks
        # `ready` — so it promised to start a to-do that waits on the user, is blocked, is
        # held by a live agent, or has an unmet prerequisite, none of which the stop would
        # ever pick up. Measured the moment auto was switched on here: it named to-do 40,
        # which has been waiting on the user for five hours.
        waiting = todo.open_items(root(), here)
        nxt = todo.ready(root(), here)
        if on:
            if standing:
                fmt.say("  Agent currently working on: " + "; ".join(w["subject"] for w in standing))
                fmt.say(f"  {len(waiting)} to-do(s) waiting; the first ready one is picked up "
                        "when that work ends.")
            elif nxt:
                fmt.say(f"  Nothing is open, {len(waiting)} to-do(s) waiting: the next idle stop "
                        f"starts to-do {nxt[0]['n']}, {nxt[0]['title']}.")
            elif waiting:
                # NOT THE SAME AS AN EMPTY LIST, and saying so is the whole point: a list
                # that is full and entirely unstartable looks identical to a finished one
                # from the outside, and the difference is what the user has to act on.
                fmt.say(f"  Nothing is open and none of the {len(waiting)} waiting to-do(s) can "
                        "be started — they wait on you, on a condition, or on each other. "
                        "`journal todos` says which.")
            else:
                fmt.say("  Nothing is open and nothing is waiting.")
        return 0
    if verb in ("from-commit", "from_commit"):
        # THE SAME PROTOCOL FROM OUTSIDE A SESSION: what the git post-commit hook calls, and
        # what a person runs after committing by hand. The agent's own commits are already
        # read at PostToolUse, and a second pass over the same sha closes nothing twice.
        ref = rest[1] if len(rest) > 1 else "HEAD"
        at = todo.commit_at(root().parent, ref)
        if at is None:
            fmt.say(f"no commit at {ref} to read", error=True)
            return 1
        sha, subject, message = at
        said = todo.close_from_commit(root(), message, f"{subject} ({sha[:9]})", _now(), here)
        if not said:
            # SILENT FOR THE GIT HOOK. This runs after every commit a person makes, and a
            # line printed on every one of them is a line they stop reading — including the
            # one that says a to-do was closed. Run by hand, it still answers.
            if not quiet:
                fmt.say(f"{sha[:9]} names no to-do — a commit closes one with a trailer:\n"
                        f"  {todo.TRAILER} todos done <n>")
            return 0
        for ok, line in said:
            fmt.say(("  " if ok else "  ! ") + line)
        return 0 if any(ok for ok, _ in said) else 1
    if verb in ("start", "done", "drop", "strike", "ask", "answer", "reopen", "move",
                "block", "unblock", "skip", "after", "needs", "report"):
        if len(rest) < 2 or not rest[1].isdigit():
            fmt.say(f'todo {verb} wants a number: journal todos {verb} 3' + (
                ' "<how>"' if verb != "start" else ""), error=True)
            return 1
        n = int(rest[1])
        if verb == "report":
            # A SUBAGENT SAYS FINISHED; THE PARENT SAYS CLOSED. Two phases, and the second
            # is where the judgement is — a runner that ticked its own box is a failure this
            # project has already watched happen.
            if not acting:
                return _refuse(f'`todos report` is a subagent saying a row is finished — put '
                               f'--as="<your agent name>" on it. If you are the agent that '
                               f'dispatched one, `journal todos done {n} "<how>"` closes it.')
            ok, msg = todo.report(root(), here, n, " ".join(rest[2:]), acting)
            fmt.say(msg, error=not ok)
            return 0 if ok else 1
        if verb in ("after", "needs"):
            ok, msg = todo.after(root(), here, n, after if after == "--none" else " ".join(rest[2:]))
            fmt.say(msg, error=not ok)
            return 0 if ok else 1
        if verb in ("block", "skip", "unblock"):
            # A CONDITION, NOT A QUESTION. `ask` waits on the user; this waits on a fact
            # about the world and is the agent's own to re-judge. Both close the work the
            # to-do opened, for the same reason: an agent that sets something aside must
            # not leave work standing behind it.
            if verb == "unblock":
                ok, msg = todo.unblock(root(), here, n)
            else:
                ok, msg = todo.block(root(), here, n, " ".join(rest[2:]))
            if ok and verb != "unblock":
                t, _ = todo._get(root(), here, n)
                if t and any(w["subject"] == t["title"] for w in work.open_work(root())):
                    closed, note = work.end(root(), t["title"], _now())
                    msg += "\n  " + (f"closed the work `{t['title']}` — it is set aside"
                                     if closed else note)
            fmt.say(msg, error=not ok)
            return 0 if ok else 1
        if verb in ("ask", "answer"):
            fn = todo.ask if verb == "ask" else todo.answer
            ok, msg = fn(root(), here, n, " ".join(rest[2:]))
            if ok and verb == "ask":
                # THE QUESTION CLOSES THE WORK the to-do opened: an agent that asks and moves
                # on must not leave work standing, or its every stop is held for it.
                t, _ = todo._get(root(), here, n)
                if t and any(w["subject"] == t["title"] for w in work.open_work(root())):
                    closed, note = work.end(root(), t["title"], _now())
                    msg += "\n  " + (f"closed the work `{t['title']}` — it waits on the answer" if closed else note)
            fmt.say(msg, error=not ok)
            return 0 if ok else 1
        if verb == "start":
            t, err = todo.start(root(), here, n, _now(), agent=acting)
            if t is None:
                fmt.say(f"{err}", error=True)
                return 1
            ok, msg = work.start(root(), t["title"], _now(), _where())
            fmt.say(msg, error=not ok)
            if ok:
                # THE SENTENCE THAT TAUGHT THE HABIT. It told every agent that ending the
                # work closes the row, which is what 710 of one project's closes did without
                # anyone deciding anything. Closing is explicit now, and this says which —
                # EXCEPT TO A SUBAGENT, whose one prohibition is closing a row: naming
                # `todos done` to it is offering the exact verb it may not use, and this
                # package has already been caught once teaching a subagent to close its own
                # homework. The `report` line below is its half.
                if acting:
                    fmt.say(f"  to-do {n} is started, and it stays open — a row closes when "
                            "whoever dispatched you closes it.")
                else:
                    fmt.say(f'  to-do {n} is started. It stays open until you say it is done:\n'
                            f'    journal todos done {n} "<how>"\n'
                            f'    journal work end "{t["title"]}" --todo   closes the work AND the row')
                if acting:
                    # THE HOLD IS THE HALF AN AGENT CANNOT SEE. `assign` said it to the
                    # dispatcher; the agent that claimed the row by starting it is told here,
                    # with the verb it will need, because the one thing it cannot do is close.
                    fmt.say(f"  it is held for `{acting}` while you are writing; "
                            f"`journal todos report {n} \"<how>\" --as={acting}` says it is finished.")
                # THE UNATTRIBUTED-START WARNING LIVED HERE AND COULD NOT BE TRUE HERE.
                # The CLI cannot see `agent_id`, so "you may be a dispatched agent" was said
                # to every session that had lent anything — noise for the parent, and still
                # only a guess for the agent. It is a refusal at the grant door now, where
                # the identity actually exists: see `grants.allows`.
                # TAUGHT WHERE IT IS NEEDED, AND NOT WHERE IT CANNOT BE USED: the trailer is
                # only ever typed in a commit message, and the moment an agent learns which
                # to-do it is on is the moment to hand it the line that closes it from there.
                # A subagent is not shown it — closing is the parent's, so a close verb in
                # front of an agent that may not close is an instruction it will try.
                if not acting:
                    fmt.say(f"  or close it from the commit that finishes it, as a trailer:\n"
                            f"    {todo.TRAILER} todos done {n}")
            return 0 if ok else 1
        why = " ".join(rest[2:])
        if verb in ("drop", "strike"):  # ruling R4: `strike` is the one retire verb everywhere
            if not why.strip():
                fmt.say(f'say why: journal todos {verb} <n> "<why it is abandoned>"', error=True)
                return 1
            why = "dropped: " + why
        if verb == "move":
            ok, msg = todo.move(root(), here, n, why, _now())
        elif verb == "reopen":
            ok, msg = todo.reopen(root(), here, n, why, _now())
        else:
            ok, msg = todo.done(root(), here, n, why, _now())
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    if verb.isdigit():
        ok, body = todo.show(root(), here, int(verb))
        fmt.say(body, error=not ok)
        return 0 if ok else 1
    if verb in ("amend", "replace"):  # ruling R5: the CLI gains a verb that CHANGES a brief
        if len(rest) < 2 or not rest[1].isdigit():
            fmt.say(f'todo {verb} wants a number: journal todos {verb} <n> ' + (
                '"<section title>" --brief' if verb == "amend" else '["<section title>"] --brief'), error=True)
            return 1
        n = int(rest[1])
        title = " ".join(rest[2:])
        text = _brief(brief)
        if text is None:
            fmt.say(BRIEF_REFUSED, error=True)
            return 1
        fn = todo.amend if verb == "amend" else todo.replace_section
        ok, msg = fn(root(), here, n, title, text)
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    if verb == "add":
        rest = rest[1:]
        if not rest:
            fmt.say('a to-do needs a title: journal todos add "<what, in a few words>"', error=True)
            return 1
    # adding: the title is the words; the brief comes on stdin ONLY when asked for with
    # --brief. Reading stdin whenever it is not a terminal hung under a test runner whose
    # stdin never closed, and a command that can hang is worse than one that asks.
    title = " ".join(rest)
    body = _brief(brief)
    if body is None:
        fmt.say(BRIEF_REFUSED, error=True)
        return 1
    where = _doc_where(doc_ref)
    if where is None:
        return 1
    ok, msg = todo.add(root(), here, title, body, _now(), where)
    fmt.say(msg, error=not ok)
    # `--after=` ON THE SAME COMMAND, because the moment you write a row that must follow
    # another is the moment you know it — and going back to say so is the step that gets
    # skipped. It is applied after the add, through the one function that validates it.
    if ok and after:
        import re as _re
        m = _re.search(r"to-do (\d+)", msg)
        if m:
            good, note = todo.after(root(), here, int(m.group(1)), after)
            fmt.say("  " + note, error=not good)
    return 0 if ok else 1


def cmd_docs(rest: list[str], brief: bool, abstract: str, page: int, replace: bool = False,
             order: str = fmt.DESC, all_of_them: bool = False, global_flag: bool = False) -> int:
    here = tracks.current(root(), _stem())
    body = _brief(brief)
    if body is None:
        fmt.say(BRIEF_REFUSED, error=True)
        return 1
    if not rest:
        # THE CATALOGUE FOR THIS ENVIRONMENT: its own docs and the project's. `--all` is the
        # whole shelf, and the sub-heading says which of the two you are looking at, because
        # a filtered list that does not announce itself is a list somebody will trust as
        # complete.
        every = docs._load(root())
        cat = every if all_of_them else [d for d in every if docs.here(d, here)]
        drafts = len([d for d in cat if d.get("status") != "final"])
        loose = docs.uncatalogued(root())
        elsewhere = len(every) - len(cat)
        sub = f"{len(cat)} catalogued" + (f" · {drafts} draft(s)" if drafts else "")
        if elsewhere:
            sub += f" · {elsewhere} on other environments (--all)"
        fmt.say(fmt.title("DOCS OF THIS PROJECT", sub=sub))
        fmt.say()
        fmt.say(docs.catalogue(root(), cap=CATALOGUE_PAGE, page=page, order=order,
                               track=here, all_of_them=all_of_them))
        if loose:
            fmt.say()
            fmt.say(fmt.wrap(f"{len(loose)} file(s) under {docs.folder(root()).name}/ are not catalogued: "
                           + ", ".join(x.name for x in loose)))
        fmt.say()
        # THE SENTENCE EVERY OTHER CATALOGUE HAS. Four of seven screens said what their
        # store is and what it costs before listing its commands; docs and tools said
        # nothing, so a reader met the commands without ever being told what they are for.
        fmt.say(fmt.wrap("What was settled, so it is not re-investigated: a doc is read on "
                         "demand and never injected, and one line of its catalogue reaches "
                         "every session. A pin, rule or to-do that rests on one cites it "
                         "with --doc=N."))
        fmt.say(fmt.commands([
            ("journal docs show <doc>", "read one, by number or name; <doc>.<p> reads one part"),
            ('journal docs add "<title>" --abstract="<one line>" --brief', "a new doc, its intro on stdin"),
            ('journal docs part <doc> "<title>" --brief', "a new part, from stdin"),
            ('journal docs attach <doc> <path> "<what it is>"', "copy a file or folder (HTML, a design, a PDF) into the doc"),
            ("journal docs <doc> files", "its attachments, as a tree; `docs files` lists every doc's"),
            ("journal docs search <term>", "every line of every doc mentioning it"),
            ('journal pins add "<claim>" --doc=<doc>[.<p>]', "cite a doc, or one part, from a pin; rule and todo take it too"),
        ] + ([("journal docs index", "catalogue the loose files")] if loose else [])))
        return 0
    verb = rest[0]
    if verb == "add":
        # A DOC BELONGS TO THE WORK IT CAME OUT OF, unless it is the project's. `--global`
        # is the opt-out, and it is a deliberate one: a doc every environment is handed at
        # every start is a charge on every session, so the reader who wants that should have
        # said so.
        ok, msg = docs.add(root(), " ".join(rest[1:]), abstract, body,
                           docs.GLOBAL if global_flag else here)
    elif verb == "part":
        if len(rest) < 3:
            fmt.say('docs part wants a doc number and a title: journal docs part 4 "<title>" --brief', error=True)
            return 1
        ok, msg = docs.part(root(), rest[1], " ".join(rest[2:]), body, here)
    elif verb == "replace":
        if len(rest) < 2:
            fmt.say("docs replace wants a part, like 4.2", error=True)
            return 1
        ok, msg = docs.replace(root(), rest[1], body, here)
    elif verb == "strike":
        if len(rest) < 3:
            fmt.say('docs strike wants a part and why: journal docs strike 4.2 "<why>"', error=True)
            return 1
        ok, msg = docs.strike(root(), rest[1], " ".join(rest[2:]))
    elif verb in ("final", "draft"):
        if len(rest) < 2:
            fmt.say(f"docs {verb} wants a doc number", error=True)
            return 1
        ok, msg = docs.set_status(root(), rest[1], verb)
    elif verb == "abstract":
        if len(rest) < 3:
            fmt.say('docs abstract wants a doc number and the line: journal docs abstract 4 "<one line>"', error=True)
            return 1
        ok, msg = docs.set_abstract(root(), rest[1], " ".join(rest[2:]))
    elif verb == "move":
        # `--global` IS A FLAG, so it never reaches `rest` — the destination is either the
        # name that was typed or the project. Saying both is a contradiction, and a command
        # that quietly picks one of two things the user asked for is worse than a refusal.
        dst = " ".join(rest[2:])
        if global_flag and dst:
            return _refuse(f'`docs move {rest[1] if len(rest) > 1 else "<doc>"}` was given both '
                           f'`--global` and `{dst}`. A doc belongs to the project or to one '
                           "environment; say which.")
        if len(rest) < 2 or not (dst or global_flag):
            return _refuse('`journal docs move <doc> "<environment>"` — or `--global` to give '
                           "it to the project, which lists it on every environment")
        ok, msg = docs.move(root(), rest[1], docs.GLOBAL if global_flag else dst)
    elif verb == "supersede":
        if len(rest) < 4 or rest[2] != "by":
            fmt.say("journal docs supersede <old> by <new>", error=True)
            return 1
        ok, msg = docs.supersede(root(), rest[1], rest[3])
    elif verb == "attach":
        if len(rest) < 3:
            fmt.say('docs attach wants a doc number and a path: journal docs attach 4 ./design.html "<what it is>"', error=True)
            return 1
        ok, msg = docs.attach(root(), rest[1], rest[2], " ".join(rest[3:]), here, replace=replace)
    elif verb in ("attachments", "files"):
        ok, msg = docs.list_attachments(root(), " ".join(rest[1:]))
    elif len(rest) > 1 and rest[-1] in ("files", "attachments"):
        ok, msg = docs.list_attachments(root(), " ".join(rest[:-1]))
    elif verb == "detach":
        if len(rest) < 4:
            fmt.say('docs detach wants a doc number, a name and why: journal docs detach 4 design.html "<why>"', error=True)
            return 1
        ok, msg = docs.detach(root(), rest[1], rest[2], " ".join(rest[3:]))
    elif verb == "index":
        for line in docs.adopt(root(), here):
            fmt.say(line)
        return 0
    elif verb == "search":
        return cmd_docs_search(" ".join(rest[1:]), page, all_of_them=all_of_them)
    # A DOC IS NAMED BY THE USER, so it can be called anything — `journal docs show search`
    # is how you read a doc called "search" when the bare form would dispatch the verb.
    elif verb in ("show", "read") and len(rest) > 1:
        ok, msg = docs.show(root(), " ".join(rest[1:]))
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    elif verb == "list" and len(rest) == 1:
        return cmd_docs([], brief, abstract, page, replace, order, all_of_them, global_flag)
    else:
        ok, msg = docs.show(root(), " ".join(rest))
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_tools(rest: list[str], brief: bool, meta: dict, page: int = 1, order: str = fmt.DESC) -> int:
    here = tracks.current(root(), _stem())
    if not rest:
        cat = tools._all(root())
        loose = tools.uncatalogued(root())
        fmt.say(fmt.title("TOOLS OF THIS PROJECT", sub=f"{len(cat)} catalogued"))
        fmt.say()
        fmt.say(tools.catalogue(root(), cap=CATALOGUE_PAGE, page=page, order=order))
        if loose:
            fmt.say()
            fmt.say(fmt.wrap(f"{len(loose)} folder(s) under .journal/tools/ have no tool.md: "
                           + ", ".join(x.name for x in loose) + " — `journal tools index` catalogues them."))
        fmt.say()
        fmt.say(fmt.wrap("Scripts kept for repeated work, so the next session runs one "
                         "instead of writing it again. A tool is the project's, like a doc; "
                         "one line of this catalogue reaches every session."))
        fmt.say(fmt.commands([
            ("journal tools show <name>", "read one — `show` reaches a tool named after a verb"),
            ("journal tools run <name> …", "run it from the project root"),
            ('journal tools add <name> "<title>" --summary="…" --usage="…" --entry=<file>', "catalogue a script"),
        ]))
        return 0
    verb = rest[0]
    if verb == "add":
        if len(rest) < 3:
            fmt.say('journal tools add <name> "<title>" --summary="<one line>" --usage="<how to call it>" [--entry=<file>] [--brief]',
                  error=True)
            return 1
        body = _brief(brief)
        if body is None:
            fmt.say(BRIEF_REFUSED, error=True)
            return 1
        ok, msg = tools.add(root(), rest[1], " ".join(rest[2:]), meta.get("summary", ""), meta.get("usage", ""),
                            meta.get("when", ""), meta.get("entry", ""), body, here)
    elif verb == "set":
        if len(rest) < 4:
            fmt.say('journal tools set <name> summary|usage|when|entry "<value>"', error=True)
            return 1
        ok, msg = tools.set_field(root(), rest[1], rest[2], " ".join(rest[3:]))
    elif verb in ("remove", "strike"):  # ruling R4: `strike` is the one retire verb everywhere
        if len(rest) < 3:
            fmt.say(f'journal tools {verb} <name> "<why>"', error=True)
            return 1
        ok, msg = tools.remove(root(), rest[1], " ".join(rest[2:]))
    elif verb == "index":
        for line in tools.adopt(root(), here):
            fmt.say(line)
        return 0
    elif verb == "run":
        fmt.say("journal tools run <name> [args…]", error=True)
        return 1
    # THE READ IS A VERB TOO, because a tool may be NAMED after one. `journal tools <name>`
    # reads a tool by putting its name where a verb goes, which works until somebody
    # catalogues a tool called `add`, `run` or `index` — and then the noun's own vocabulary
    # eats it, silently and forever. `journal tools show add` is the way to say "the tool
    # called add" no matter what it is called. The bare form stays: ruling R3, nothing that
    # runs today stops running.
    elif verb in ("show", "info", "read") and len(rest) > 1:
        ok, msg = tools.show(root(), rest[1])
    elif verb == "list" and len(rest) == 1:
        return cmd_tools([], brief, meta, page, order)
    else:
        ok, msg = tools.show(root(), verb)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_docs_search(term: str, page: int = 1, width: int | None = None,
                    all_of_them: bool = False) -> int:
    width = fmt.room(width)
    import textwrap
    needle = term.lower()
    if not needle:
        fmt.say("docs search wants a term", error=True)
        return 1
    here = tracks.current(root(), _stem())
    every = docs.search_lines(root(), all_of_them=True)
    lines = every if all_of_them else docs.search_lines(root(), track=here)
    hits = [(ref, title, i, line) for ref, title, i, line in lines if needle in line.lower()]
    elsewhere = len([1 for r, t, i, l in every if needle in l.lower()]) - len(hits)
    if not hits:
        fmt.say(fmt.title(f"NO DOC MENTIONS {term!r}",
                          sub=f"{elsewhere} on other environments (--all)" if elsewhere else ""))
        fmt.say(fmt.commands([(f"journal search {term}", "the transcript instead")]
                             + ([(f"journal docs search {term} --all", "every environment's docs")]
                                if elsewhere else [])))
        return 0
    pages = max(1, -(-len(hits) // PAGE))
    page = min(max(1, page), pages)
    lo, hi = (page - 1) * PAGE, page * PAGE
    said = [f"page {page} of {pages}"] if pages > 1 else []
    if elsewhere:
        said.append(f"{elsewhere} on other environments (--all)")
    fmt.say(fmt.title(f"{len(hits)} DOC LINE(S) MENTION {term!r}", sub=" · ".join(said)))
    last = None
    for ref, title, i, line in hits[lo:hi]:
        if ref != last:
            fmt.say(fmt.section(f"doc {ref}  {title}"))
            last = ref
        body = " ".join(line.split())
        j = body.lower().find(needle)
        body = body[:j] + "«" + body[j:j + len(term)] + "»" + body[j + len(term):]
        fmt.say(textwrap.fill(body, width=width, initial_indent=f"  {i:>4}  ", subsequent_indent="        "))
    fmt.say()
    rows = [("journal docs <doc>", "read the doc, by number or name")]
    if page < pages:
        rows.insert(0, (f"journal docs search {term} --page={page + 1}", f"the next {min(PAGE, len(hits) - hi)}"))
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


def cmd_next() -> int:
    """What to do now: the details of the last hold, or the state of the list.

    THE BACK HALF OF A ONE-LINE HOLD, and the prompt a loop fires at an idle auto session.
    A hold says `journal next` for its details; a loop says `journal next` every few
    minutes; both land here, and here says the one thing to do.
    """
    import state as _st
    stem = _stem()
    here = tracks.current(root(), _stem())
    held = _st.get(root(), "next_text", "", stem=stem) if stem else ""
    # A SNAPSHOT IS SHOWN ONLY WHILE IT IS STILL TRUE. The hold recorded which to-dos were
    # open when it wrote this; if that has changed, the text may be offering finished work
    # and the live answer below is the honest one.
    if held and _st.get(root(), "next_rows", None, stem=stem) not in (
            None, sorted(t["n"] for t in todo.open_items(root(), here))):
        held = ""
        _st.put(root(), "next_text", "", stem=stem)
    if held:
        # A HOLD'S DETAILS ARE READ ONCE, AND THE SNAPSHOT DIES WITH THE READING. This text
        # was written by the hold that sent you here, and it describes the list AS IT WAS AT
        # THAT STOP. Nothing refreshed it afterwards, so a loop firing `journal next` every
        # fifteen minutes went on being handed the same frozen listing — and it listed
        # to-dos that had been CLOSED in between, offering finished work as the next thing
        # to do while `journal todo` correctly showed them done. Two commands, one store,
        # two answers, and the wrong one is the one an agent in auto mode reads.
        #
        # So the text is consumed: shown once, then cleared, and every later call recomputes
        # from the record. The next hold writes the next snapshot.
        _st.put(root(), "next_text", "", stem=stem)
        fmt.say(held)
        return 0
    standing = work.open_work(root())
    if standing:
        fmt.say("Open work: " + "; ".join(w["subject"] for w in standing))
        fmt.say("Carry on with it; `journal work end \"<the same words>\"` when it is done, or\n"
                '`journal work await "<what you wait on>" --pid=<n>|--agent=<id>` if it is in '
                "flight on\nsomething you cannot hurry.")
        return 0
    if todo.auto(root(), here):
        ready = todo.ready(root(), here)
        if ready:
            t = ready[0]
            fmt.say(f"Auto mode is on and nothing is open. Next: to-do {t['n']}, {t['title']}")
            fmt.say(f"  journal todos {t['n']}          the brief")
            fmt.say(f"  journal todos start {t['n']}    pick it up")
            return 0
        blocked = todo.asking(root(), here)
        if blocked:
            fmt.say(f"Nothing to pick up: {len(blocked)} to-do(s) wait on the user's answer. "
                  "Stop the loop if one is running; `journal todo` shows the questions.")
        else:
            fmt.say("The list is empty. Stop the loop if one is running.")
        return 0
    waiting = todo.open_items(root(), here)
    fmt.say(f"Nothing is open. {len(waiting)} to-do(s) waiting; auto is off, so none starts "
          "without the user's word." if waiting else "Nothing is open and nothing is waiting.")
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


def cmd_strike(n: int, why: str) -> int:
    ok, msg = pins.strike(root(), n, why)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_pin_full(n: int) -> int:
    conf, _ = settings_mod.load(root())
    ok, body = pins.around(root(), n, project(), conf["pin_context"])
    fmt.say(body, error=not ok)
    return 0 if ok else 1


def cmd_remind(text: str, until: str) -> int:
    """`journal reminders add` — start saying this again at every stop."""
    conf, _ = settings_mod.load(root())
    ok, msg = reminders.add(root(), text, _now(), conf["reminder_max_chars"], until)
    fmt.say(msg, error=not ok)
    if ok and conf["reminder_every"]:
        fmt.say(f"  and again every {conf['reminder_every']} tool calls in between "
                "(settings: reminder_every)")
    return 0 if ok else 1


def cmd_reminder_done(n: int, why: str) -> int:
    ok, msg = reminders.done(root(), n, why, _now())
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_idea_add(text: str) -> int:
    """`journal ideas add` — one line, jotted and moved past."""
    conf, _ = settings_mod.load(root())
    ok, msg = ideas.add(root(), text, _now(), conf["idea_max_chars"])
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_idea_drop(n: int, why: str) -> int:
    ok, msg = ideas.drop(root(), n, why, _now())
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_idea_promote(n: int, title: str) -> int:
    ok, msg = ideas.promote(root(), n, _now(), tracks.current(root(), _stem()), title)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_ideas(all_of_them: bool, page: int = 1, order: str = fmt.DESC) -> int:
    n = len(ideas.live(root()))
    dropped = len(ideas._all(root())) - n
    sub = f"{n} standing" + (f", {dropped} dropped" if all_of_them and dropped else "")
    return _catalogue(
        "IDEAS", sub,
        ideas.listing(root(), all_of_them=all_of_them, cap=CATALOGUE_PAGE, page=page, order=order),
        "Nothing jotted down yet.",
        "The project's, not one environment's — unstructured, no owner, no promise. "
        "Write one down small; decide later whether it becomes real work.",
        [('journal ideas add "<the idea>"', "jot one down"),
         ('journal ideas promote <n> --title="<to-do title>"', "it became real work, filed on this environment"),
         ('journal ideas drop <n> "<why>"', "tried, superseded, or not worth it")],
        noun="ideas", page=page, order=order)


def _catalogue(title: str, sub: str, listed, empty: str, lead: str, rows,
               noun: str = "", page: int = 1, order: str = fmt.DESC) -> int:
    """A numbered catalogue page: heading, the list, why it matters, what to type.

    `pins` and `reminders` were this function written twice — same heading, same list, same
    footer, differing only in the noun and the commands. A third would have been a third
    copy, which is how the last four drifted apart.

    IT TAKES ROWS, NOT A RENDERED LIST. Handed text, the page could only paste it in as a
    paragraph — which reflowed a numbered list into prose the first time it was tried here.
    Rows keep their shape because the renderer, not the caller, decides what a row is.
    """
    items, left = listed
    fmt.say(fmt.Out(title=title, sub=sub,
                    items=(tuple(items) or (fmt.Item(text=empty),))
                          + ((fmt.Item(text=fmt.more(noun, left, page, order).strip()),)
                             if left else ())
                          + (fmt.Item(text=lead),)
                          + tuple(fmt.Item(title=c, text=w) for c, w in rows)))
    return 0


def cmd_reminders(all_of_them: bool, page: int = 1, order: str = fmt.DESC) -> int:
    """The list, and what it costs — the one catalogue whose entries are re-read for free
    by nobody. Every line here is said at every stop, so the count is the headline."""
    conf, _ = settings_mod.load(root())
    n = len(reminders.live(root()))
    retired = len(reminders._all(root())) - n
    sub = f"environment {tracks.current(root(), _stem())} · {n} repeated"
    if all_of_them and retired:
        sub += f", {retired} retired"
    every = f", and every {conf['reminder_every']} tool calls in between" if conf["reminder_every"] else ""
    return _catalogue(
        "REMINDERS", sub,
        reminders.listing(root(), all_of_them=all_of_them, cap=CATALOGUE_PAGE, page=page, order=order),
        "Nothing is being repeated.",
        f"Said to you at every stop{every}, and to the user with it — they wrote it, and "
        "seeing it come back is how they know it landed. Nothing here expires on its own.",
        [('journal reminders add "<instruction>" [--until="<condition>"]', "start repeating one; --until is prose YOU judge"),
         ('journal reminders done <n> "<why>"', "retire one whose condition came true"),
         ('journal reminders move <n> "<environment>"', "it belongs to an environment, like a pin"),
         ("journal reminders --all", "the retired ones too")],
        noun="reminders", page=page, order=order)


def cmd_pins(all_of_them: bool, page: int = 1, order: str = fmt.DESC) -> int:
    conf, _ = settings_mod.load(root())
    here = tracks.current(root(), _stem())
    n = len(pins.live(root()))
    struck = len(pins._all(root())) - n
    sub = f"environment {here} · {n} standing" + (
        f" · {struck} struck" + ("" if all_of_them else " (--all shows them)") if struck else "")
    code = _catalogue(
        "PINS", sub,
        pins.listing(root(), all_of_them=all_of_them, cap=CATALOGUE_PAGE, page=page, order=order),
        "Nothing is pinned.",
        "Handed to every session on this environment.",
        [("journal pins <n> --full", "the conversation around one"),
         ("journal pins promote <n>", "make one a rule for every environment"),
         ('journal pins strike <n> "<why>"', "retire one that stopped being true")],
        noun="pins", page=page, order=order)
    got = transcript.session_transcript(project())
    if got:
        import state as _st
        read = context.pressure(got[0], conf["context_window"], _st.get(root(), "window", 0) or 0)
        if read:
            fmt.say(f"Context {read[0]:.0%} full ({read[1]:,} of {read[2]:,})." if read[3] else
                    f"Context: {read[1]:,} tokens; the window is learned at the first "
                    "compaction, or set context_window in .journal/settings.json.")
    return code


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


def _refuse(why: str) -> int:
    """Say one refusal and fail. The only place a refusal is printed."""
    fmt.say(why, error=True)
    return 1


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
    supersedes: int | None = None
    all_of_them: bool = False
    go_back: bool = False
    fresh: bool = False
    full: bool = False
    wait_for: float | None = None
    await_agent: str | None = None
    await_pid: int | None = None
    on: str | None = None
    strike_n: int | None = None
    brief: bool = False
    quiet: bool = False
    replace: bool = False
    off_flag: bool = False
    list_flag: bool = False
    global_flag: bool = False
    project_too: bool = False
    all_sessions: bool = False
    yes_flag: bool = False
    force: bool = False
    close_todo: bool = False
    order: str = fmt.DESC
    sessions: list
    page: int = 1
    abstract: str = ""
    until: str = ""
    after: str = ""
    acting: str = ""
    to_agent: str = ""
    doc_ref: str = ""
    from_src: str | None = None
    serve_port: int | None = None
    open_browser: bool = False
    title: str = ""
    tool_meta: dict

    def __init__(self):
        # THE TWO THAT MUST NOT BE SHARED. Everything above is immutable and safe as a
        # class attribute; a list and a dict are not, and a default_factory is exactly what
        # a dataclass would have generated here.
        self.sessions = []
        self.tool_meta = {}


class _Flag(NamedTuple):
    """One row of the flag table. `dest` is the Opts field it fills; None means the
    option is recognised and consumed here but read elsewhere (`--env=`, `--from=`).
    `type` converts a `--x=value`'s text — raising ValueError with the refusal to print
    if it cannot. `append`/`keyed` are the two shapes a value can land in besides a
    plain assignment: a list that grows, or a dict keyed by the flag's own name. `set`
    is what a bare flag (no value at all) writes into its dest.
    """
    dest: str | None = None
    type: object = str
    append: bool = False
    keyed: bool = False
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


def _supersedes_flag(v: str) -> int:
    try:
        return int(v)
    except ValueError:
        raise ValueError("--supersedes wants a pin number; `journal pins` numbers them")


def _for_flag(v: str) -> float:
    try:
        return float(v)
    except ValueError:
        raise ValueError(f"--for wants minutes, got {v!r}")


def _order_flag(v: str) -> str:
    v = v.strip().lower()
    if v not in fmt.ORDERS:
        raise ValueError(f"--order wants asc or desc, got {v!r}. Newest first is the "
                          "default; --order=asc reads oldest first.")
    return v


def _agent_flag(v: str) -> str | None:
    return v.strip() or None


# `--x=value` FLAGS. Aliases share one `_Flag` instance — `--after` and `--needs` are
# one entry with two names, the way the to-do asks, not two branches that could drift.
_AFTER = _Flag(dest="after")
_ENV_NOOP = _Flag(dest=None)      # applied and refused in run(), before any command reads the record
_TOOL_META = _Flag(dest="tool_meta", keyed=True)

VALUE_FLAGS: dict[str, _Flag] = {
    "--back": _Flag(dest="back", type=_int_flag("--back")),
    "--supersedes": _Flag(dest="supersedes", type=_supersedes_flag),
    "--agent": _Flag(dest="await_agent", type=_agent_flag),
    "--pid": _Flag(dest="await_pid", type=_int_flag("--pid")),
    "--for": _Flag(dest="wait_for", type=_for_flag),
    "--on": _Flag(dest="on"),
    "--env": _ENV_NOOP, "--environment": _ENV_NOOP, "--track": _ENV_NOOP,
    "--order": _Flag(dest="order", type=_order_flag),
    "--session": _Flag(dest="sessions", append=True),
    "--abstract": _Flag(dest="abstract"),
    "--until": _Flag(dest="until"),
    "--after": _AFTER, "--needs": _AFTER,
    "--as": _Flag(dest="acting"),
    "--to": _Flag(dest="to_agent"),
    "--summary": _TOOL_META, "--usage": _TOOL_META, "--when": _TOOL_META, "--entry": _TOOL_META,
    "--doc": _Flag(dest="doc_ref"),
    "--from": _Flag(dest="from_src"),
    "--page": _Flag(dest="page", type=_page_flag),
    "--port": _Flag(dest="serve_port", type=_int_flag("--port")),
    "--title": _Flag(dest="title"),
}

# BARE FLAGS: no value, presence is the value. `set` is what lands in `dest`; every
# flag not listed writes `True`, so only the two exceptions (`--strike`, `--none`) name
# theirs.
BARE_FLAGS: dict[str, _Flag] = {
    "--strike": _Flag(dest="strike_n", set=-1),    # the number follows as the next word
    "--off": _Flag(dest="off_flag"),
    #: A DOC BELONGS TO ITS ENVIRONMENT UNLESS THIS SAYS THE PROJECT'S — see `docs.GLOBAL`.
    "--global": _Flag(dest="global_flag"),
    #: `grant` LENDS BARE now, so its listing needed a spelling of its own — `_v_grant`.
    "--list": _Flag(dest="list_flag"),
    "--replace": _Flag(dest="replace"),
    "--brief": _Flag(dest="brief"),
    "--quiet": _Flag(dest="quiet"),
    "--project": _Flag(dest="project_too"),
    "--yes": _Flag(dest="yes_flag"),
    "--force": _Flag(dest="force"),
    "--todo": _Flag(dest="close_todo"),
    "--todos": _Flag(dest="close_todo"),
    "--all-sessions": _Flag(dest="all_sessions"),
    "--none": _Flag(dest="after", set="--none"),    # `todos after <n> --none` clears the prerequisites
    "--full": _Flag(dest="full"),
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


def _v_pin(verb: str, rest: list[str], opts: Opts) -> int:
    if len(rest) < 2:
        return _refuse("pin wants the claim, in one line")
    return cmd_remember(" ".join(rest[1:]), opts.supersedes, opts.doc_ref)


def _v_rule(verb: str, rest: list[str], opts: Opts) -> int:
    if opts.strike_n is not None:
        if len(rest) < 3:
            return _refuse('rule --strike wants a number and why: journal rule --strike 2 "<why>"')
        n, why = _number(rest, 1, "rule --strike", "rule", "journal rules")
        return _refuse(why) if why else cmd_rule("", n, " ".join(rest[2:]))
    if len(rest) < 2:
        return _refuse("rule wants the ruling, in one line")
    return cmd_rule(" ".join(rest[1:]), None, "", opts.doc_ref)


def _v_rules(verb: str, rest: list[str], opts: Opts) -> int:
    # NOUN+VERB ALIASES (ruling R1: plural canonical) — `add`/`strike`/`list`/`show`
    # call the exact same functions the old `rule`/`rule --strike` branches call, so
    # the two spellings can never drift apart.
    sub = rest[1] if len(rest) > 1 else ""
    if sub == "move":
        return _refuse("a rule binds EVERY environment, so there is nowhere to move it to. If it "
                "only describes one line of work it was never a rule: strike it and pin it "
                "there —\n"
                '  journal rules strike <n> "<why>"\n'
                '  journal pins add "<the claim>"')
    if sub == "add":
        said, why = _words(rest, 2, "rules add", "the ruling, in one line")
        if why:
            return _refuse(why)
        long = _brief(opts.brief)
        if long is None:
            return _refuse(BRIEF_REFUSED)
        return cmd_rule(" ".join(rest[2:]), None, "", opts.doc_ref, long)
    if sub in ("amend", "replace"):
        return cmd_body(pins.RULES, sub, rest[2:], opts.brief)
    if sub == "strike":
        if len(rest) > 2 and builtin.by_id(rest[2]):
            return _refuse(f"{rest[2].upper()} is the journal's own rule, not this "
                           "project's — it holds wherever the journal is installed, so "
                           "striking it here would be a local opinion wearing the tool's "
                           "authority. `builtin_rules: false` in settings.json turns them "
                           "all off.")
        if len(rest) < 4:
            return _refuse('rules strike wants a rule number and why: journal rules strike 2 "<why>"')
        n, why = _number(rest, 2, "rules strike", "rule", "journal rules")
        return _refuse(why) if why else cmd_rule("", n, " ".join(rest[3:]))
    if sub == "list":
        return cmd_rules(opts.all_of_them, None, False, opts.page, opts.order)
    if sub == "show":
        if len(rest) < 3:
            return _refuse("rules show wants a rule number: journal rules show 3")
        shipped = builtin.by_id(rest[2])
        if shipped:
            fmt.say(fmt.title(f"RULE {shipped['id']}", sub="the journal's own, in every project"))
            fmt.say()
            fmt.say(fmt.wrap(shipped["fact"]))
            fmt.say()
            fmt.say(fmt.block(shipped["body"]))
            return 0
        n, why = _number(rest, 2, "rules show", "rule", "journal rules")
        return _refuse(why) if why else cmd_claim_page(n, pins.RULES)
    n = None
    if len(rest) > 1:
        try:
            n = int(rest[1])
        except ValueError:
            return _refuse(f"rules wants a NUMBER with --full, got {rest[1]!r}")
    return cmd_rules(opts.all_of_them, n, opts.full, opts.page, opts.order)


def _v_promote(verb: str, rest: list[str], opts: Opts) -> int:
    if len(rest) < 2:
        return _refuse("promote wants a pin number: journal pins promote 3")
    try:
        return cmd_promote(int(rest[1]))
    except ValueError:
        return _refuse(_number(rest, 1, "promote", "pin", "journal pins")[1])


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


def _v_strike(verb: str, rest: list[str], opts: Opts) -> int:
    if len(rest) < 3:
        return _refuse('strike wants a pin number and why: journal pins strike 6 "<why>"')
    try:
        n = int(rest[1])
    except ValueError:
        return _refuse(_number(rest, 1, "strike", "pin", "journal pins")[1])
    return cmd_strike(n, " ".join(rest[2:]))


def _v_reminders(verb: str, rest: list[str], opts: Opts) -> int:
    # THE NOUN OWNS ITS VERBS, and the bare singular is an ALIAS of the list rather
    # than a shortcut for `add`: `journal remind` printing the reminders is a read, and
    # a verb whose argument is missing must never take the payload's place.
    sub = rest[1] if len(rest) > 1 else ""
    if sub == "add":
        said, why = _words(rest, 2, "reminders add", 'the instruction, in one line: '
                            'journal reminders add "<what to keep telling you>"')
        if why:
            return _refuse(why)
        return cmd_remind(" ".join(rest[2:]), opts.until)
    if sub in ("done", "retire", "strike", "stop"):
        if len(rest) < 4:
            return _refuse('reminders done wants a number and why: '
                    'journal reminders done 2 "<what made it true>"')
        n, why = _number(rest, 2, "reminders done", "reminder", "journal reminders")
        return _refuse(why) if why else cmd_reminder_done(n, " ".join(rest[3:]))
    if sub == "move":
        if len(rest) < 4 or not rest[2].isdigit():
            return _refuse('reminders move wants a number and an environment: '
                    'journal reminders move 2 "<environment>"')
        ok, msg = reminders.move(root(), int(rest[2]), " ".join(rest[3:]), _now())
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    if sub == "list":
        return cmd_reminders(opts.all_of_them, opts.page, opts.order)
    if sub:
        return _refuse(f"reminders has no {sub!r}. It takes add, done, move, list — and a "
                "bare `journal reminders` reads them.")
    return cmd_reminders(opts.all_of_them, opts.page, opts.order)


def _v_ideas(verb: str, rest: list[str], opts: Opts) -> int:
    sub = rest[1] if len(rest) > 1 else ""
    if sub == "add":
        said, why = _words(rest, 2, "ideas add", "the idea, in one line")
        if why:
            return _refuse(why)
        return cmd_idea_add(said)
    if sub in ("drop", "strike"):
        if len(rest) < 4:
            return _refuse('ideas drop wants a number and why: journal ideas drop 2 "<why>"')
        n, why = _number(rest, 2, "ideas drop", "idea", "journal ideas")
        return _refuse(why) if why else cmd_idea_drop(n, " ".join(rest[3:]))
    if sub == "promote":
        n, why = _number(rest, 2, "ideas promote", "idea", "journal ideas")
        if why:
            return _refuse(why)
        return cmd_idea_promote(n, opts.title)
    if sub == "list":
        return cmd_ideas(opts.all_of_them, opts.page, opts.order)
    if sub:
        return _refuse(f"ideas has no {sub!r}. It takes add, drop, promote, list — and a "
                "bare `journal ideas` reads them.")
    return cmd_ideas(opts.all_of_them, opts.page, opts.order)


def _v_pins(verb: str, rest: list[str], opts: Opts) -> int:
    # NOUN+VERB ALIASES (ruling R1: plural canonical) — `add`/`strike`/`promote`/
    # `list`/`show` call the exact same functions the old bare top-level `pin`,
    # `strike` and `promote` verbs call, so the two spellings can never drift apart.
    sub = rest[1] if len(rest) > 1 else ""
    if sub == "add":
        said, why = _words(rest, 2, "pins add", "the claim, in one line")
        if why:
            return _refuse(why)
        long = _brief(opts.brief)
        if long is None:
            return _refuse(BRIEF_REFUSED)
        return cmd_remember(" ".join(rest[2:]), opts.supersedes, opts.doc_ref, long)
    if sub in ("amend", "replace"):
        return cmd_body(pins.KEY, sub, rest[2:], opts.brief)
    if sub == "move":
        if len(rest) < 4 or not rest[2].isdigit():
            return _refuse('pins move wants a pin number and an environment: '
                    'journal pins move 6 "<environment>"')
        ok, msg = pins.move(root(), int(rest[2]), " ".join(rest[3:]), _now())
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    if sub == "strike":
        if len(rest) < 4:
            return _refuse('pins strike wants a pin number and why: journal pins strike 6 "<why>"')
        n, why = _number(rest, 2, "pins strike", "pin", "journal pins")
        return _refuse(why) if why else cmd_strike(n, " ".join(rest[3:]))
    if sub == "promote":
        if len(rest) < 3:
            return _refuse("pins promote wants a pin number: journal pins promote 3")
        n, why = _number(rest, 2, "pins promote", "pin", "journal pins")
        return _refuse(why) if why else cmd_promote(n)
    if sub == "list":
        return cmd_pins(opts.all_of_them, opts.page, opts.order)
    if sub == "show":
        if len(rest) < 3:
            return _refuse("pins show wants a pin number: journal pins show 3")
        n, why = _number(rest, 2, "pins show", "pin", "journal pins")
        return _refuse(why) if why else cmd_claim_page(n, pins.KEY)
    if len(rest) > 1 and opts.full:
        try:
            return cmd_pin_full(int(rest[1]))
        except ValueError:
            return _refuse(f"pins wants a NUMBER with --full, got {rest[1]!r}")
    return cmd_pins(opts.all_of_them, opts.page, opts.order)


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


def _v_work(verb: str, rest: list[str], opts: Opts) -> int:
    sub = rest[1] if len(rest) > 1 else ""
    if sub not in ("start", "end", "update", "await"):
        return _refuse('journal work start|update|end|await "<words>"')
    # --force NEEDS NO WORDS: the case it exists for is work nobody can name any more.
    if len(rest) < 3 and not (sub == "end" and opts.force):
        return _refuse(f'work {sub} wants the words: journal work {sub} "<the work>"')
    words = " ".join(rest[2:])
    if sub == "await":
        return cmd_await(words, opts.on, opts.wait_for, opts.await_agent, opts.await_pid)
    if sub == "update":
        return cmd_update(words, opts.on)
    return cmd_start(words) if sub == "start" else cmd_end(words, opts.force, opts.acting, opts.close_todo)


def _v_start_end(verb: str, rest: list[str], opts: Opts) -> int:
    # kept so a session that learned the old spelling is not stranded mid-work
    if len(rest) < 2:
        return _refuse(f"{verb} wants the words that name the work")
    subject = " ".join(rest[1:])
    return cmd_start(subject) if verb == "start" else cmd_end(subject, opts.force, opts.acting, opts.close_todo)


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
    ("pin", "remember"): _v_pin,
    ("todo", "todos"): lambda verb, rest, opts: cmd_todo(
        rest[1:], opts.all_of_them, opts.brief, opts.doc_ref, opts.after, opts.acting,
        opts.page, opts.order, opts.quiet),
    ("reminders", "reminder", "remind"): _v_reminders,
    ("ideas", "idea"): _v_ideas,
    ("start", "end"): _v_start_end,
    ("migrate", "migrations"): _v_migrate,
    ENV_NOUNS: _v_environments,
}

COMMANDS: dict[str, object] = {name: fn for names, fn in _ALIASES.items() for name in names}
COMMANDS.update({
    "assign": _v_assign,
    "user": lambda verb, rest, opts: cmd_user(opts.back),
    "open": lambda verb, rest, opts: cmd_open(),
    "search": _v_search,
    "nothing": lambda verb, rest, opts: cmd_nothing(" ".join(rest[1:])),
    "rule": _v_rule,
    "rules": _v_rules,
    "promote": _v_promote,
    "docs": lambda verb, rest, opts: cmd_docs(rest[1:], opts.brief, opts.abstract, opts.page,
                                              opts.replace, opts.order, opts.all_of_them,
                                              opts.global_flag),
    "tools": lambda verb, rest, opts: cmd_tools(rest[1:], opts.brief, opts.tool_meta, opts.page, opts.order),
    "carry": lambda verb, rest, opts: cmd_carry(opts.fresh),
    "claim": lambda verb, rest, opts: cmd_claim(rest[1] if len(rest) > 1 else "", " ".join(rest[2:])),
    "prepare": lambda verb, rest, opts: cmd_prepare(" ".join(rest[1:])),
    "loop": lambda verb, rest, opts: cmd_loop(rest[1:]),
    "switch": lambda verb, rest, opts: cmd_switch(" ".join(rest[1:]), opts.go_back, opts.project_too, opts.sessions or None, opts.all_sessions),
    "strike": _v_strike,
    "pins": _v_pins,
    "update": _v_update,
    "upgrade": _v_upgrade,
    "work": _v_work,
    "verify": _v_verify,
    "settings": lambda verb, rest, opts: cmd_settings(),
    "worktree": _v_worktree,
    "next": lambda verb, rest, opts: cmd_next(),
    "serve": lambda verb, rest, opts: cmd_serve(opts.serve_port, opts.open_browser),
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
                if spec.keyed:
                    opts.tool_meta[name[2:]] = converted
                elif spec.append:
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
