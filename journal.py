#!/usr/bin/env python3
"""journal — a session survives its own compaction.

A compaction keeps what was DONE and loses what was DECIDED. The transcript on disk lost
nothing. This is the index that gets you back to it.

    journal                 where things stand: environment, rules, pins, open work, to-dos, context
    journal next            what to do now: the details of the last hold, or the next to-do

Every group below prints its own commands, and so does every spelling of them:
`journal <noun> help`.

    work           declare it, move it, wait on something, close it
    pins           a claim that must survive a compaction, on this environment
    rules          a pin that every environment obeys
    todos          delayed work, parked with the brief you will need in a week
    docs           what was settled: findings, reports, the reasoning a pin cites
    tools          scripts kept for repeated work
    environments   where work lives: switch, prepare, delegate, handoff, worktree
    transcript     read it back: conversation, user, search, carry
    system         verify, version, update, settings, loop

THE PLURAL NOUN IS THE CANONICAL SPELLING (ruling R10). Every singular and legacy one —
`pin`, `rule`, `todo`, `remember`, `tracks`, bare `strike` and `promote` — still runs, still
answers `help`, and calls the very same function. None of them is deprecated.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import digest
import docs
import fmt
import help
import settings as settings_mod
import context
import pins
import tags
import todo
import tools
import tracks
import transcript
import update
import verify
import work


import worktree as _wt

_ROOT, _WT_NOTE = _wt.resolve(Path(__file__).parent if Path(__file__).parent.is_symlink()
                              else Path(__file__).resolve().parent)
if _WT_NOTE:
    fmt.say(f"  {_WT_NOTE}", error=True)


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
_ENV_FLAG = next((a.split("=", 1)[1] for a in sys.argv[1:] if a.startswith(("--env=", "--environment=", "--track="))), "")
if _ENV_FLAG:
    _ENV_FLAG = _state.slug(_ENV_FLAG) or "default"
    tracks.override(_ENV_FLAG)
_state.use_track(tracks.current(_ROOT, _stem()))


def _load(back: int = 0):
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
#: (`journal environments`, `journal environments "<name>"`) are not here: they are the noun
#: itself, and a name is not a verb.
ENV_VERBS = ("switch", "claim", "prepare", "delegate", "handoff")


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
        fmt.say(f"No such command: {verb}\n", error=True)
        fmt.say(__doc__, error=True)
        return 1
    fmt.say(f"journal {verb}\n")
    fmt.say("\n".join("    " + l for l in lines))
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
        ("environment", here + ("   (delegated)" if tracks.delegated(root(), _stem()) else "")
         + (f"   (parked: {', '.join(others)})" if others else ""), "journal environments"),
        ("rules", f"{ruled} in force on every environment" if ruled else "none", "journal rules"),
        ("pins", f"{pinned} standing on this environment" if pinned else "none", "journal pins"),
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
    body = digest.render(seg)
    fmt.say(body if body.strip() else "  (nothing was said in this stretch)")
    if back == 0 and n:
        fmt.say()
        fmt.say(fmt.commands([("journal conversation --back=1", "precisely what the last summary dropped")]))
    return 0


def cmd_user(back: int) -> int:
    _, _, _, seg, _ = _load(back)
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


def cmd_end(subject: str) -> int:
    """Close the work, and ask the one question that is only answerable now.

    THE MOMENT WORK CLOSES IS THE MOMENT YOU KNOW WHAT IT TAUGHT. Before it, you cannot
    say; long after, you no longer remember there was anything to say. Pins were coming out
    sparse — three in a full day of work — and the only prompt to write one fired at 75%
    context, which is late and is about the compaction rather than about the work.

    It ASKS, it does not hold. A gate here would be a third rule, and this is a question
    with a legitimate answer of "nothing" — most work teaches nothing that outlives it.
    """
    ok, msg = work.end(root(), subject, _now())
    fmt.say(msg, error=not ok)
    if ok:
        closed = todo.close_titled(root(), tracks.current(root(), _stem()), subject, _now())
        if closed:
            fmt.say(f"  to-do {closed} is done with it.")
        fmt.say('  did that teach anything a later reader would get wrong without?\n'
              '    journal pins add "<the claim, in one line>"   (or nothing, which is fine)')
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


def cmd_search(term: str, all_of_them: bool = False, width: int = 88, page: int = 1) -> int:
    """Every line mentioning the term on this environment, across every session of the project.

    A ENVIRONMENT HAS A TRANSCRIPT — everything said while it was current, in every session —
    and that is what is searched, because a ruling made on this environment last week is as
    much this environment's as one made an hour ago. `--all` searches every environment. The line
    number is the citation and leads, with the session it belongs to; the passage is a
    window around the first mention, wrapped, with the term marked so the eye lands on it.
    """
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
    if _stem() and tracks.delegated(root(), _stem()):
        where["via"] = "delegation"   # the words may be a subagent's, one level under this transcript
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
        doc, prt, _ = docs.get(root(), doc_ref)
        doc_ref = f"{doc['n']}.{prt['p']}" if prt else str(doc["n"])   # a name resolves once; the number stays
        where["doc"] = doc_ref
    return where


def cmd_remember(fact: str, supersedes: int | None, doc_ref: str = "") -> int:
    conf, _ = settings_mod.load(root())
    where = _doc_where(doc_ref)
    if where is None:
        return 1
    ok, msg = pins.add(root(), fact, _now(), conf["pin_max_chars"], supersedes, where)
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


def cmd_rule(fact: str, strike_n: int | None, why: str, doc_ref: str = "") -> int:
    conf, _ = settings_mod.load(root())
    if strike_n is not None:
        ok, msg = pins.strike(root(), strike_n, why, key=pins.RULES)
    else:
        where = _doc_where(doc_ref)
        if where is None:
            return 1
        ok, msg = pins.add(root(), fact, _now(), conf["pin_max_chars"], None, where,
                           key=pins.RULES)
        if ok:
            _decided("ruled")
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_rules(all_of_them: bool, n: int | None, full: bool, page: int = 1) -> int:
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
    fmt.say(pins.render(root(), all_of_them=all_of_them, key=pins.RULES, cap=CATALOGUE_PAGE, page=page))
    fmt.say()
    fmt.say(fmt.wrap("Handed first to every session and to every subagent."))
    fmt.say(fmt.commands([
        ("journal rules <n> --full", "the conversation around one"),
        ('journal rules strike <n> "<why>"', "repeal one"),
    ]))
    return 0


def cmd_promote(n: int) -> int:
    ok, msg = pins.promote(root(), n, _now(), _where())
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_todo(rest: list[str], all_of_them: bool, brief: bool = False, doc_ref: str = "", page: int = 1) -> int:
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
        fmt.say(todo.render(root(), here, all_of_them=all_of_them, cap=CATALOGUE_PAGE, page=page))
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
        waiting = todo.open_items(root(), here)
        if on:
            if standing:
                fmt.say("  Agent currently working on: " + "; ".join(w["subject"] for w in standing))
                fmt.say(f"  {len(waiting)} to-do(s) waiting; the first is picked up when that work ends.")
            elif waiting:
                fmt.say(f"  Nothing is open, {len(waiting)} to-do(s) waiting: the next idle stop starts "
                      f"to-do {waiting[0]['n']}, {waiting[0]['title']}.")
            else:
                fmt.say("  Nothing is open and nothing is waiting.")
        return 0
    if verb in ("start", "done", "drop", "strike", "ask", "answer"):
        if len(rest) < 2 or not rest[1].isdigit():
            fmt.say(f'todo {verb} wants a number: journal todos {verb} 3' + (
                ' "<how>"' if verb != "start" else ""), error=True)
            return 1
        n = int(rest[1])
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
            t, err = todo.start(root(), here, n, _now(), strict=bool(tracks.delegated(root(), _stem())))
            if t is None:
                fmt.say(f"{err}", error=True)
                return 1
            ok, msg = work.start(root(), t["title"], _now(), _where())
            fmt.say(msg, error=not ok)
            if ok:
                fmt.say(f"  to-do {n} is started; `journal work end \"{t['title']}\"` closes both.")
            return 0 if ok else 1
        why = " ".join(rest[2:])
        if verb in ("drop", "strike"):  # ruling R4: `strike` is the one retire verb everywhere
            if not why.strip():
                fmt.say(f'say why: journal todos {verb} <n> "<why it is abandoned>"', error=True)
                return 1
            why = "dropped: " + why
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
        text = sys.stdin.read() if brief else ""
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
    body = sys.stdin.read() if brief else ""
    where = _doc_where(doc_ref)
    if where is None:
        return 1
    ok, msg = todo.add(root(), here, title, body, _now(), where)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_docs(rest: list[str], brief: bool, abstract: str, page: int, replace: bool = False) -> int:
    here = tracks.current(root(), _stem())
    body = sys.stdin.read() if brief else ""
    if not rest:
        cat = docs._load(root())
        drafts = len([d for d in cat if d.get("status") != "final"])
        loose = docs.uncatalogued(root())
        sub = f"{len(cat)} catalogued" + (f" · {drafts} draft(s)" if drafts else "")
        fmt.say(fmt.title("DOCS OF THIS PROJECT", sub=sub))
        fmt.say()
        fmt.say(docs.catalogue(root(), cap=CATALOGUE_PAGE, page=page))
        if loose:
            fmt.say()
            fmt.say(fmt.wrap(f"{len(loose)} file(s) under {docs.folder(root()).name}/ are not catalogued: "
                           + ", ".join(x.name for x in loose)))
        fmt.say()
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
        ok, msg = docs.add(root(), " ".join(rest[1:]), abstract, body, here)
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
        return cmd_docs_search(" ".join(rest[1:]), page)
    # A DOC IS NAMED BY THE USER, so it can be called anything — `journal docs show search`
    # is how you read a doc called "search" when the bare form would dispatch the verb.
    elif verb in ("show", "read") and len(rest) > 1:
        ok, msg = docs.show(root(), " ".join(rest[1:]))
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    elif verb == "list" and len(rest) == 1:
        return cmd_docs([], brief, abstract, page, replace)
    else:
        ok, msg = docs.show(root(), " ".join(rest))
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_tools(rest: list[str], brief: bool, meta: dict, page: int = 1) -> int:
    here = tracks.current(root(), _stem())
    if not rest:
        cat = tools._all(root())
        loose = tools.uncatalogued(root())
        fmt.say(fmt.title("TOOLS OF THIS PROJECT", sub=f"{len(cat)} catalogued"))
        fmt.say()
        fmt.say(tools.catalogue(root(), cap=CATALOGUE_PAGE, page=page))
        if loose:
            fmt.say()
            fmt.say(fmt.wrap(f"{len(loose)} folder(s) under .journal/tools/ have no tool.md: "
                           + ", ".join(x.name for x in loose) + " — `journal tools index` catalogues them."))
        fmt.say()
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
        body = sys.stdin.read() if brief else ""
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
        return cmd_tools([], brief, meta, page)
    else:
        ok, msg = tools.show(root(), verb)
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_docs_search(term: str, page: int = 1, width: int = 88) -> int:
    import textwrap
    needle = term.lower()
    if not needle:
        fmt.say("docs search wants a term", error=True)
        return 1
    hits = [(ref, title, i, line) for ref, title, i, line in docs.search_lines(root())
            if needle in line.lower()]
    if not hits:
        fmt.say(fmt.title(f"NO DOC MENTIONS {term!r}"))
        fmt.say(fmt.commands([(f"journal search {term}", "the transcript instead")]))
        return 0
    pages = max(1, -(-len(hits) // PAGE))
    page = min(max(1, page), pages)
    lo, hi = (page - 1) * PAGE, page * PAGE
    fmt.say(fmt.title(f"{len(hits)} DOC LINE(S) MENTION {term!r}",
                    sub=f"page {page} of {pages}" if pages > 1 else ""))
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
        fmt.say("Carry on with it; `journal work end \"<the same words>\"` when it is done.")
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
    """Show the block a compaction hands back, without being a compaction.

    Worth a command of its own because it is the one output nobody could see: assembled
    inside a hook, delivered into a context the user does not read, and previously visible
    only by piping a fake payload into `hook.py` — which wrote state, so looking at it
    changed it.
    """
    import hook
    fmt.say(hook.carried("startup" if fresh else "compact"))
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
session, or by a subagent. Only when the user asked for it. In order:

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
journal delegate "{name}" and dispatch a subagent with the page as its brief.
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


def cmd_handoff(name: str, source: str, run: bool, off: bool, sessions: list[str] | None = None) -> int:
    """The main agent's two dispatches: the hand-off agent, then the runner."""
    import handoff
    name = _state.slug(name)
    stem = _stem()
    if off:
        return cmd_delegate("", True, sessions)
    if not stem:
        fmt.say("a hand-off is a session's: run it from inside one", error=True)
        return 1
    current = tracks.delegated(root(), stem)
    if current and current != name:
        fmt.say(f"this session is delegating `{current}` — `journal handoff --off` when that run is over, then again",
                error=True)
        return 1
    if not name:
        fmt.say('handoff what? journal handoff "<environment>" "<issue link, id or text>"', error=True)
        return 1
    conf, _ = settings_mod.load(root())
    excl, stale = conf["one_session_per_environment"], conf["session_stale_hours"]
    if not run:
        if name not in tracks._all(root()):
            ok, msg = tracks.switch(root(), name, _now(), stem, exclusive=excl, stale_hours=stale)
            if not ok:
                fmt.say(msg, error=True)
                return 1
        if tracks.delegated(root(), stem) != name:
            ok, msg = tracks.delegate(root(), stem, name, stale, excl)
            if not ok:
                fmt.say(msg, error=True)
                return 1
        text, origin = handoff.prompt(root(), "handoff agent", name, source)
        if not text:
            fmt.say(f"the template at {origin} has no `# handoff agent` section", error=True)
            return 1
        fmt.say(fmt.title("HANDOFF", sub=f"{name} · delegated to this session · template: {origin}"))
        fmt.say("")
        fmt.say(fmt.wrap("Dispatch ONE subagent with the prompt below: subagent_type general-purpose, model opus. "
                         "Do nothing else on this environment until it reports. READY: read "
                         f"`journal environments \"{name}\"` yourself, then `journal handoff \"{name}\" --run` for the "
                         "runner's prompt. BLOCKED: put its question to the user; dispatch no runner."))
        fmt.say("")
        fmt.say(fmt.section("prompt for the hand-off agent"))
        fmt.say("")
        fmt.say(text)
        return 0
    ok, page = tracks.page(root(), name, commands=False)
    if not ok:
        fmt.say(page, error=True)
        return 1
    if not todo.ready(root(), name):
        fmt.say(f"nothing on `{name}` is ready to start — the hand-off agent reported BLOCKED, or every to-do "
                f"waits on the user. `journal environments \"{name}\"` shows what there is; no runner is dispatched "
                "for an empty list", error=True)
        return 1
    if tracks.delegated(root(), stem) != name:
        ok, msg = tracks.delegate(root(), stem, name, stale, excl)
        if not ok:
            fmt.say(msg, error=True)
            return 1
    # AUTO GOES ON FOR THE RUN, and the command does it rather than trusting the prompt.
    # A runner exists to work a list to its end; with auto off its stop is not held for the
    # next to-do and it must be told to continue, which is a conversation the session is not
    # having — it dispatched an agent precisely so it would not have to. `handoff --off`
    # does not switch it back: the environment keeps whatever the run left, and the user
    # turns it off with `journal todos auto off` if the leftovers are theirs to decide.
    was_auto = todo.auto(root(), name)
    if not was_auto:
        todo.set_auto(root(), name, True)
    text, origin = handoff.prompt(root(), "runner agent", name, source, page)
    if not text:
        fmt.say(f"the template at {origin} has no `# runner agent` section", error=True)
        return 1
    fmt.say(fmt.title("HANDOFF", sub=f"{name} · the run · auto {'was already on' if was_auto else 'is now ON'} · template: {origin}"))
    fmt.say("")
    fmt.say(fmt.wrap("Dispatch ONE subagent with the prompt below (a general-purpose agent; name the model — "
                     "sonnet for careful work without invention, opus for judgement) AND GIVE IT ITS OWN "
                     "WORKTREE — `isolation: \"worktree\"` — so that two runs of two environments never edit one "
                     "checkout. Its journal still lands here: a linked worktree's `.journal` is a symlink to "
                     "this one."))
    fmt.say("")
    fmt.say(fmt.wrap("It hands back a BRANCH, and what becomes of that is yours to settle. If the user has "
                     "already asked for the work to be merged, say so in the prompt — add a line granting it — "
                     "and it merges when it is done. If they have not, do not merge on your own: when it "
                     "reports, tell the user what is on the branch and OFFER the merge. Either way, read "
                     f"`journal environments \"{name}\"` before you file anything; `journal handoff --off` ends the delegation."))
    fmt.say("")
    fmt.say(fmt.section("prompt for the runner"))
    fmt.say("")
    fmt.say(text)
    return 0


def cmd_delegate(name: str, off: bool, sessions: list[str] | None = None) -> int:
    conf, _ = settings_mod.load(root())
    if off and sessions:
        # FROM A TERMINAL, FOR A SESSION THAT DIED MID-RUN: its delegation would otherwise
        # hold the environment until it goes stale.
        done = 0
        for sid in list(tracks._bindings(root())):
            if any(sid.startswith(w) for w in sessions) and tracks.delegated(root(), sid):
                ok, msg = tracks.undelegate(root(), sid)
                fmt.say(f"{sid[:8]}: {msg}")
                done += 1
        if not done:
            fmt.say("no session with that id is delegating anything", error=True)
        return 0 if done else 1
    stem = _stem()
    if not stem:
        fmt.say("delegation is a session's: run it from inside one (from a terminal: --off --session=<id>)", error=True)
        return 1
    if off:
        was = tracks.delegated(root(), stem)
        if was:
            _state.use_track(was)
            standing = [w["subject"] for w in work.open_work(root())]
            left = todo.open_items(root(), was)
            if standing or left:
                fmt.say(fmt.wrap(f"on `{was}` still: " + "; ".join(
                    ([f"open work — {', '.join(standing)}"] if standing else [])
                    + ([f"{len(left)} to-do(s) waiting, {len(todo.asking(root(), was))} on the user"] if left else []))))
    ok, msg = tracks.undelegate(root(), stem) if off else tracks.delegate(
        root(), stem, name, conf["session_stale_hours"], conf["one_session_per_environment"])
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def cmd_tracks(name: str = "") -> int:
    conf, _ = settings_mod.load(root())
    if name:
        ok, msg = tracks.page(root(), name, commands=tracks.delegated(root(), _stem()) != _state.slug(name))
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    rows = tracks.listing(root(), _stem(), conf["session_stale_hours"])
    fmt.say(fmt.title("ENVIRONMENTS", sub="* this session · > where new sessions start"))
    fmt.say()
    for t in rows:
        mark = ("*" if t["current"] else " ") + (">" if t["start"] else " ")
        who = ("   sessions: " + ", ".join(f"{sid[:8]} ({t['seen'].get(sid, '')})" for sid in t["sessions"])) if t["sessions"] else ""
        fmt.say(f" {mark} {t['name']:<28} {t['pins']} pin(s), {t['open']} open{who}")
    fmt.say()
    fmt.say(fmt.commands([
        ('journal switch "<name>"', "this session onto that environment (from a terminal: the project's start environment)"),
        ('journal switch "<name>" --project', "this session, and where new sessions start"),
        ('journal switch "<name>" --session=<id>', "move one bound session; --all-sessions moves every one"),
        ("journal switch --back", "the one you came from"),
    ]))
    fmt.say(fmt.wrap("Nothing is ever closed by switching." + (
        " One running session works an environment at a time; a stale session is one not seen for "
        f"{conf['session_stale_hours']:g} h." if conf["one_session_per_environment"] else "")))
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


def cmd_pins(all_of_them: bool, page: int = 1) -> int:
    conf, _ = settings_mod.load(root())
    here = tracks.current(root(), _stem())
    n = len(pins.live(root()))
    struck = len(pins._all(root())) - n
    sub = f"environment {here} · {n} standing" + (
        f" · {struck} struck" + ("" if all_of_them else " (--all shows them)") if struck else "")
    fmt.say(fmt.title("PINS", sub=sub))
    fmt.say()
    fmt.say(pins.render(root(), all_of_them=all_of_them, cap=CATALOGUE_PAGE, page=page))
    fmt.say()
    fmt.say(fmt.wrap("Handed to every session on this environment."))
    fmt.say(fmt.commands([
        ("journal pins <n> --full", "the conversation around one"),
        ("journal pins promote <n>", "make one a rule for every environment"),
        ('journal pins strike <n> "<why>"', "retire one that stopped being true"),
    ]))
    got = transcript.session_transcript(project())
    if got:
        import state as _st
        read = context.pressure(got[0], conf["context_window"], _st.get(root(), "window", 0) or 0)
        if read and read[3]:
            fmt.say(fmt.wrap(f"Context {read[0]:.0%} full ({read[1]:,} of {read[2]:,})."))
        elif read:
            fmt.say(fmt.wrap(f"Context: {read[1]:,} tokens; the window is learned at the first "
                           "compaction, or set context_window in .journal/settings.json."))
    return 0


def cmd_settings() -> int:
    conf, problems = settings_mod.load(root())
    f = root() / settings_mod.PATH
    fmt.say(fmt.title("SETTINGS", sub=str(f) if f.is_file() else "no file, every default in force"))
    fmt.say()
    for key, default in settings_mod.DEFAULTS.items():
        mark = " " if conf[key] == default else "*"
        fmt.say(f" {mark} {key:<24} {str(conf[key]):<22} {fmt.dim('default ' + str(default))}")
    if any(conf[k] != settings_mod.DEFAULTS[k] for k in settings_mod.DEFAULTS):
        fmt.say()
        fmt.say(fmt.wrap("* set in settings.json"))
    for p in problems:
        fmt.say(f"\n  ! {p}")
    return 1 if problems else 0


def main(argv: list[str]) -> int:
    back = 0
    supersedes = None
    all_of_them = False
    go_back = False
    fresh = False
    full = False
    wait_for = None
    await_agent = None
    await_pid = None
    on = None
    strike_n = None
    brief = False
    replace = False
    off_flag = False
    run_flag = False
    project_too = False
    all_sessions = False
    sessions: list[str] = []
    page = 1
    abstract = ""
    doc_ref = ""
    tool_meta = {}
    rest = []
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
    for a in argv:
        if a.startswith("--back="):
            try:
                back = int(a.split("=", 1)[1])
            except ValueError:
                fmt.say(f"--back wants a number, got {a.split('=', 1)[1]!r}", error=True)
                return 1
        elif a.startswith("--supersedes="):
            try:
                supersedes = int(a.split("=", 1)[1])
            except ValueError:
                fmt.say("--supersedes wants a pin number; `journal pins` numbers them", error=True)
                return 1
        elif a.startswith("--agent="):
            await_agent = a.split("=", 1)[1].strip() or None
        elif a.startswith("--pid="):
            try:
                await_pid = int(a.split("=", 1)[1])
            except ValueError:
                fmt.say(f"--pid wants a number, got {a.split('=', 1)[1]!r}", error=True)
                return 1
        elif a.startswith("--for="):
            try:
                wait_for = float(a.split("=", 1)[1])
            except ValueError:
                fmt.say(f"--for wants minutes, got {a.split('=', 1)[1]!r}", error=True)
                return 1
        elif a.startswith("--on="):
            on = a.split("=", 1)[1]
        elif a == "--strike":
            strike_n = -1  # the number follows as the next word
        elif a.startswith(("--env=", "--environment=", "--track=")):
            if _state.slug(a.split("=", 1)[1]) not in tracks._all(root()):
                fmt.say(f"no environment is called {_state.slug(a.split('=', 1)[1])!r}; `journal environments` lists them, "
                        "`journal switch` or `journal prepare` creates one", error=True)
                return 1
        elif a == "--off":
            off_flag = True
        elif a == "--run":
            run_flag = True
        elif a == "--replace":
            replace = True
        elif a == "--brief":
            brief = True
        elif a == "--project":
            project_too = True
        elif a == "--all-sessions":
            all_sessions = True
        elif a.startswith("--session="):
            sessions.append(a.split("=", 1)[1])
        elif a.startswith("--abstract="):
            abstract = a.split("=", 1)[1]
        elif a.startswith(("--summary=", "--usage=", "--when=", "--entry=")):
            tool_meta[a[2:].split("=", 1)[0]] = a.split("=", 1)[1]
        elif a.startswith("--doc="):
            doc_ref = a.split("=", 1)[1]
        elif a.startswith("--from="):
            pass  # read by `upgrade`
        elif a.startswith("--page="):
            try:
                page = int(a.split("=", 1)[1])
            except ValueError:
                fmt.say("--page wants a number", error=True)
                return 1
        elif a == "--full":
            full = True
        elif a == "--fresh":
            fresh = True
        elif a == "--back":
            go_back = True
        elif a == "--all":
            all_of_them = True
        elif a.startswith("--") and len(a) > 2:
            fmt.say(f"unknown option {a!r}. `journal help` lists the commands and their options.",
                  error=True)
            return 1
        else:
            rest.append(a)
    verb = rest[0] if rest else ""
    # THE NOUN OWNS ITS VERBS, and `environments` is a noun like every other. Ruling R11
    # keeps switch, claim, prepare, delegate and handoff as TOP-LEVEL verbs, because they
    # are burned into hook.py, handoff.default.md and every generated .journal/handoff.md
    # — but top-level was never meant to be the ONLY spelling. A reader who learned
    # `journal todos start` and `journal pins add` looks for `journal environments switch`,
    # and finding nothing there is the inconsistency this whole pass exists to end. Both
    # spellings dispatch to the same function, the way `todo` and `todos` already do.
    if verb in ("environments", "envs", "tracks") and len(rest) > 1 and rest[1] in ENV_VERBS:
        rest = rest[1:]
        verb = rest[0]
    # `show` AND `list` STAY UNDER THE NOUN, because neither is a top-level verb: there is
    # no `journal show`. An environment can be named anything, `switch` and `claim`
    # included, so `journal environments show "claim"` is how its page is read.
    if verb in ("environments", "envs", "tracks") and len(rest) > 1 and rest[1] in ("show", "read"):
        if len(rest) < 3:
            fmt.say('environments show wants a name: journal environments show "<name>"', error=True)
            return 1
        return cmd_tracks(" ".join(rest[2:]))
    if verb in ("environments", "envs", "tracks") and len(rest) == 2 and rest[1] == "list":
        return cmd_tracks("")
    if verb == "user":
        return cmd_user(back)
    if verb == "open":
        return cmd_open()
    if verb == "search":
        if len(rest) < 2:
            fmt.say("search wants a term", error=True)
            return 1
        return cmd_search(" ".join(rest[1:]), all_of_them, page=page)
    if verb in ("pin", "remember"):
        if len(rest) < 2:
            fmt.say("pin wants the claim, in one line", error=True)
            return 1
        return cmd_remember(" ".join(rest[1:]), supersedes, doc_ref)
    if verb == "nothing":
        return cmd_nothing(" ".join(rest[1:]))
    if verb == "rule":
        if strike_n is not None:
            if len(rest) < 3:
                fmt.say('rule --strike wants a number and why: journal rule --strike 2 "<why>"',
                      error=True)
                return 1
            try:
                return cmd_rule("", int(rest[1]), " ".join(rest[2:]))
            except ValueError:
                fmt.say(f"rule --strike wants a NUMBER, got {rest[1]!r}. `journal rules` numbers them.",
                      error=True)
                return 1
        if len(rest) < 2:
            fmt.say("rule wants the ruling, in one line", error=True)
            return 1
        return cmd_rule(" ".join(rest[1:]), None, "", doc_ref)
    if verb == "rules":
        # NOUN+VERB ALIASES (ruling R1: plural canonical) — `add`/`strike`/`list`/`show`
        # call the exact same functions the old `rule`/`rule --strike` branches call, so
        # the two spellings can never drift apart. Anything else falls to the unchanged
        # shape below: bare `rules`, or `rules <n> --full`.
        sub = rest[1] if len(rest) > 1 else ""
        if sub == "add":
            if len(rest) < 3:
                fmt.say("rule wants the ruling, in one line", error=True)
                return 1
            return cmd_rule(" ".join(rest[2:]), None, "", doc_ref)
        if sub == "strike":
            if len(rest) < 4:
                fmt.say('rules strike wants a rule number and why: journal rules strike 2 "<why>"',
                      error=True)
                return 1
            try:
                return cmd_rule("", int(rest[2]), " ".join(rest[3:]))
            except ValueError:
                fmt.say(f"rules strike wants a rule NUMBER, got {rest[2]!r}. `journal rules` numbers them.",
                      error=True)
                return 1
        if sub == "list":
            return cmd_rules(all_of_them, None, False, page)
        if sub == "show":
            if len(rest) < 3:
                fmt.say("rules show wants a rule number: journal rules show 3", error=True)
                return 1
            try:
                return cmd_rules(all_of_them, int(rest[2]), True)
            except ValueError:
                fmt.say(f"rules show wants a rule NUMBER, got {rest[2]!r}. `journal rules` numbers them.",
                      error=True)
                return 1
        n = None
        if len(rest) > 1:
            try:
                n = int(rest[1])
            except ValueError:
                fmt.say(f"rules wants a NUMBER with --full, got {rest[1]!r}", error=True)
                return 1
        return cmd_rules(all_of_them, n, full, page)
    if verb == "promote":
        if len(rest) < 2:
            fmt.say("promote wants a pin number: journal pins promote 3", error=True)
            return 1
        try:
            return cmd_promote(int(rest[1]))
        except ValueError:
            fmt.say(f"promote wants a pin NUMBER, got {rest[1]!r}. `journal pins` numbers them.",
                  error=True)
            return 1
    if verb in ("todo", "todos"):  # ruling R1: `todos` is a twin alias of `todo`, both ways
        return cmd_todo(rest[1:], all_of_them, brief, doc_ref, page)
    if verb == "docs":
        return cmd_docs(rest[1:], brief, abstract, page, replace)
    if verb == "tools":
        return cmd_tools(rest[1:], brief, tool_meta, page)
    if verb == "carry":
        return cmd_carry(fresh)
    if verb == "claim":
        return cmd_claim(rest[1] if len(rest) > 1 else "", " ".join(rest[2:]))
    if verb in ("environments", "envs", "tracks"):
        return cmd_tracks(" ".join(rest[1:]))
    if verb == "prepare":
        return cmd_prepare(" ".join(rest[1:]))
    if verb == "handoff":
        args = [a for a in rest[1:] if a not in ("--run", "--off")]
        return cmd_handoff(args[0] if args else "", " ".join(args[1:]), "--run" in rest or run_flag, "--off" in rest or off_flag, sessions or None)
    if verb == "delegate":
        return cmd_delegate(" ".join(a for a in rest[1:] if a != "--off"), "--off" in rest or off_flag, sessions or None)
    if verb == "loop":
        return cmd_loop(rest[1:])
    if verb == "switch":
        return cmd_switch(" ".join(rest[1:]), go_back, project_too, sessions or None, all_sessions)
    if verb == "strike":
        if len(rest) < 3:
            fmt.say('strike wants a pin number and why: journal pins strike 6 "<why>"',
                  error=True)
            return 1
        try:
            n = int(rest[1])
        except ValueError:
            fmt.say(f"strike wants a pin NUMBER, got {rest[1]!r}. `journal pins` numbers them.",
                  error=True)
            return 1
        return cmd_strike(n, " ".join(rest[2:]))
    if verb == "pins":
        # NOUN+VERB ALIASES (ruling R1: plural canonical) — `add`/`strike`/`promote`/
        # `list`/`show` call the exact same functions the old bare top-level `pin`,
        # `strike` and `promote` verbs call, so the two spellings can never drift apart.
        # Anything else falls to the unchanged shape below: bare `pins`, or `pins <n>
        # --full`.
        sub = rest[1] if len(rest) > 1 else ""
        if sub == "add":
            if len(rest) < 3:
                fmt.say("pin wants the claim, in one line", error=True)
                return 1
            return cmd_remember(" ".join(rest[2:]), supersedes, doc_ref)
        if sub == "strike":
            if len(rest) < 4:
                fmt.say('pins strike wants a pin number and why: journal pins strike 6 "<why>"',
                      error=True)
                return 1
            try:
                n = int(rest[2])
            except ValueError:
                fmt.say(f"pins strike wants a pin NUMBER, got {rest[2]!r}. `journal pins` numbers them.",
                      error=True)
                return 1
            return cmd_strike(n, " ".join(rest[3:]))
        if sub == "promote":
            if len(rest) < 3:
                fmt.say("pins promote wants a pin number: journal pins promote 3", error=True)
                return 1
            try:
                return cmd_promote(int(rest[2]))
            except ValueError:
                fmt.say(f"pins promote wants a pin NUMBER, got {rest[2]!r}. `journal pins` numbers them.",
                      error=True)
                return 1
        if sub == "list":
            return cmd_pins(all_of_them, page)
        if sub == "show":
            if len(rest) < 3:
                fmt.say("pins show wants a pin number: journal pins show 3", error=True)
                return 1
            try:
                return cmd_pin_full(int(rest[2]))
            except ValueError:
                fmt.say(f"pins show wants a pin NUMBER, got {rest[2]!r}. `journal pins` numbers them.",
                      error=True)
                return 1
        if len(rest) > 1 and full:
            try:
                return cmd_pin_full(int(rest[1]))
            except ValueError:
                fmt.say(f"pins wants a NUMBER with --full, got {rest[1]!r}", error=True)
                return 1
        return cmd_pins(all_of_them, page)
    if verb == "update" and len(rest) > 1:
        # `journal update` upgrades the journal; a note on the work is `journal work update`
        fmt.say('journal update upgrades the journal. Progress on the open work is:\n'
              '  journal work update "<what moved>"', error=True)
        return 1
    if verb == "work":
        sub = rest[1] if len(rest) > 1 else ""
        if sub not in ("start", "end", "update", "await"):
            fmt.say('journal work start|update|end|await "<words>"', error=True)
            return 1
        if len(rest) < 3:
            fmt.say(f'work {sub} wants the words: journal work {sub} "<the work>"', error=True)
            return 1
        words = " ".join(rest[2:])
        if sub == "await":
            return cmd_await(words, on, wait_for, await_agent, await_pid)
        if sub == "update":
            return cmd_update(words, on)
        return cmd_start(words) if sub == "start" else cmd_end(words)
    if verb in ("start", "end"):
        # kept so a session that learned the old spelling is not stranded mid-work
        if len(rest) < 2:
            fmt.say(f"{verb} wants the words that name the work", error=True)
            return 1
        subject = " ".join(rest[1:])
        return cmd_start(subject) if verb == "start" else cmd_end(subject)
    if verb == "verify":
        body, ok = verify.render(root())
        fmt.say(body)
        return 0 if ok else 1
    if verb == "settings":
        return cmd_settings()
    if verb == "worktree":
        if len(rest) > 1 and rest[1] == "link":
            ok, msg = _wt.link(Path(__file__).parent if Path(__file__).parent.is_symlink()
                               else Path(__file__).resolve().parent)
            fmt.say(msg, error=not ok)
            return 0 if ok else 1
        main = _wt.main_root(project())
        fmt.say(f"a linked worktree of {main}; .journal " + ("is a symlink to its journal" if (project() / ".journal").is_symlink() else "is a COPY — `journal worktree link` fixes that")
              if main else "not a linked worktree")
        return 0
    if verb == "next":
        return cmd_next()
    if verb == "version":
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
    if verb in ("upgrade", "update"):
        src = next((a.split("=", 1)[1] for a in argv if a.startswith("--from=")), None)
        ok, msg = update.upgrade(root(), src)
        fmt.say(msg, error=not ok)
        return 0 if ok else 1
    if verb == "conversation":
        return cmd_read(back)
    if verb:
        fmt.say(f"No such command: {verb}\n", error=True)
        fmt.say(__doc__, error=True)
        return 1
    # `journal --back=1` alone still reads: the block and the skill said it for a day,
    # and a reader with the old words in mind must not land on a status page instead.
    return cmd_read(back) if any(a.startswith("--back") for a in argv) else cmd_status()


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
