#!/usr/bin/env python3
"""journal — a session survives its own compaction.

A compaction keeps what was DONE and loses what was DECIDED. The transcript on disk lost
nothing. This is the index that gets you back to it.

    journal                 where things stand: track, rules, pins, open work, to-dos, context
    journal conversation    what was said since the last compaction
    journal conversation --back=N   N compactions back; --back=1 is what the last summary REPLACED
    journal user            only the user's own words, in full
    journal open            work declared and never closed
    journal search <term> [--all] [--page=N]   every line mentioning it on this track, in every session, 25 a page newest first; --all is every track
    journal pin "<claim>" [--supersedes=N]   a claim that must survive a compaction (remember still works)
    journal nothing "<why>"  after a context warning: nothing here needs pinning, and why
    journal rule "<ruling>"  a pin for EVERY track — what the project decided, not one line of work
    journal rules [--all]    every rule, numbered; `rules N --full` reads around one
    journal rule --strike N "<why>"   repeal a rule that stopped being true
    journal promote N        lift pin N into a rule; the pin is struck and says where it went
    journal todo "<title>" [--brief]   delayed work, on this track; --brief reads a longer brief from stdin
    journal todo [--all]     the titles, numbered
    journal todo N           the whole brief
    journal todo start N     open work with that title — `end` then closes both
    journal todo done N "<how>"   resolved without starting it
    journal todo drop N "<why>"   abandoned, on the record
    journal todo ask N "<question>"   it waits on the user; auto moves on to the next
    journal todo answer N "<answer>"  the user answers it; the agent is told at its next stop and picks it up first
    journal docs             the catalogue: every doc, its status, parts and abstract
    journal docs N | N.P     read a doc, or one part of it
    journal docs add "<title>" --abstract "<one line>" --brief   a new doc; the brief on stdin is its intro
    journal docs part N "<title>" --brief   a new part of doc N, from stdin — a report, a section, a finding
    journal docs replace N.P --brief        a new body for a part; the old one is kept under struck/
    journal docs strike N.P "<why>"         drop a part, on the record
    journal docs final N | draft N          its status
    journal docs abstract N "<one line>"    the line every session is handed
    journal docs supersede N by M           point readers of N at M
    journal docs index                      catalogue the files docs/ already holds
    journal docs search <term> [--page=N]   every line of every doc mentioning it
    --doc=N or --doc=N.P on remember, rule and todo cites a doc from the entry
    journal todo auto [on|off]    work through this track's list without asking, or wait for the user's word
    journal pins [--all]    every pin, numbered — the number is what --supersedes takes
    journal pins N --full   the conversation around where pin N was written
    journal strike N "<why>" retire a pin that stopped being true, no replacement needed
    journal work start "<what>"  declare work — a commitment, which is why it costs a command
    journal work update "<what moved>" [--on="<work>"]   progress on the open work
    journal work end "<what>"    the same words, to close it
    journal carry           exactly what a compaction will hand back — nothing is written
    journal tracks          every track, this session's marked, and which sessions are on which
    journal switch "<name>" [--project|--session=<id>|--all-sessions]   this session's track; --project also where new sessions start; from a terminal always the project
    journal next            what to do now: the details of the last hold, or the next to-do
    journal worktree [link] is this a linked worktree, and does .journal link to the main checkout's? `link` makes it so
    journal tools           the tools: scripts kept for repeated work, with what each does and how to call it
    journal tools <name>    read one
    journal tools run <name> [args…]   run it from the project root
    journal tools add <name> "<title>" --summary="<one line>" [--usage="<how>"] [--when="<when>"] [--entry=<file>] [--brief]
    journal tools set <name> summary|usage|when|entry "<value>"
    journal tools remove <name> "<why>"   retire it, kept under struck/
    journal tools index     a tool.md for every folder under .journal/tools/ that has none
    journal verify          is any of this in force? wired is not the same as fired
    journal version         this project's version of the journal, and whether a newer one is out
    journal update [--from=<path or git url>]    pull the latest journal and print what changed
    journal settings        every setting, its value, and where it came from
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import digest
import docs
import fmt
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
    print(f"  {_WT_NOTE}", file=sys.stderr)


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
_state.use_track(tracks.current(_ROOT, _stem()))


def _load(back: int = 0):
    conf, problems = settings_mod.load(root())
    for p in problems:
        print(f"  ! {p}", file=sys.stderr)
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
        print("No transcript for this project yet.", file=sys.stderr)
        raise SystemExit(1)
    return got[0]


def _resolved() -> tuple[Path, bool] | None:
    got = transcript.session_transcript(project())
    if got and got[1]:
        print(f"  (guessed: newest transcript, {got[0].name} — {transcript.SESSION_ENV} is "
              "not set)", file=sys.stderr)
    return got


def _help(verb: str = "") -> int:
    """The whole synopsis, or only the lines about one verb."""
    if not verb:
        print(__doc__)
        return 0
    lines = [l for l in (__doc__ or "").splitlines()
             if l.strip().startswith(f"journal {verb}") or l.strip().startswith(f"journal --{verb}")]
    if verb in ("start", "end"):
        lines = [l for l in (__doc__ or "").splitlines() if l.strip().startswith(f"journal work {verb}")]
    if verb == "remember":
        lines = [l for l in (__doc__ or "").splitlines() if l.strip().startswith("journal pin ")]
    if not lines:
        print(f"No such command: {verb}\n", file=sys.stderr)
        print(__doc__, file=sys.stderr)
        return 1
    print(f"journal {verb}\n")
    print("\n".join(lines))
    return 0


def cmd_status() -> int:
    """Where things stand, on one screen. What bare `journal` shows.

    The bare command used to print the conversation, which is the one output nobody wants
    by accident: long, and not what a person glancing at the journal is asking. What they
    are asking is "what is the state of this thing" — the track, what stands, what waits.
    """
    conf, problems = settings_mod.load(root())
    for p in problems:
        print(f"  ! {p}", file=sys.stderr)
    here = tracks.current(root(), _stem())
    ruled = len(pins.live(root(), pins.RULES))
    pinned = len(pins.live(root()))
    standing = work.open_work(root())
    waiting = todo.open_items(root(), here)
    on_user = todo.asking(root(), here)
    others = [t["name"] for t in tracks.listing(root()) if not t["current"]]
    rows = [
        ("track", here + (f"   (parked: {', '.join(others)})" if others else ""), "journal tracks"),
        ("rules", f"{ruled} in force on every track" if ruled else "none", "journal rules"),
        ("pins", f"{pinned} standing on this track" if pinned else "none", "journal pins"),
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
    print(fmt.title("JOURNAL", sub=f"track {here}"))
    print()
    print(fmt.facts(rows))
    if on_user:
        print(fmt.section("waiting on the user"))
        for t in on_user:
            print(fmt.numbered(t["n"], t["title"]))
            print(fmt.wrap(t["asks"], indent=5))
    print()
    print(fmt.commands([
        ("journal conversation [--back=N]", "what was said, since the last compaction or before it"),
        ("journal search <term>", "every line mentioning it on this track, and who said it"),
        ("journal help", "every command"),
    ]))
    return 0


def cmd_read(back: int) -> int:
    conf, lines, boundaries, seg, path = _load(back)
    n = len(boundaries)
    if back > n:
        # SAY IT RATHER THAN CLAMP. `since` shows the oldest stretch for any N past the
        # first compaction; labelling that as "N back" is an index that lies.
        print(f"  ! only {n} compaction(s) in this session; showing the oldest stretch",
              file=sys.stderr)
        back = n
    where = "since the last compaction" if back == 0 else f"the stretch {back} summary/ies back replaced"
    print(fmt.title("CONVERSATION", sub=f"{where} · {len(seg)} lines · {n} compaction(s) in this session"))
    print()
    body = digest.render(seg)
    print(body if body.strip() else "  (nothing was said in this stretch)")
    if back == 0 and n:
        print()
        print(fmt.commands([("journal conversation --back=1", "precisely what the last summary dropped")]))
    return 0


def cmd_user(back: int) -> int:
    _, _, _, seg, _ = _load(back)
    body = digest.users_only(seg)
    print(fmt.title("THE USER'S OWN WORDS", sub="in full, never trimmed"))
    print(body if body.strip() else "\n  (the user said nothing in this stretch)")
    return 0


def cmd_open() -> int:
    standing = work.open_work(root())
    if not standing:
        print("Nothing is open.")
        return 0
    print(fmt.title("OPEN WORK", sub="declared and never closed"))
    for w in standing:
        print()
        print(f"  {w['subject']}")
        print(f"     {fmt.dim('since ' + w['at'][:16].replace('T', ' '))}")
        # THE NOTES ARE THE POINT OF `open`, not decoration. A subject alone says a thing
        # is in flight; the notes say where it got to, which is what a reader on the far
        # side of a compaction actually needs before they touch it.
        for note in w.get("notes", []):
            print(fmt.wrap(f"{note['at'][11:16]}  {note['text']}", indent=5))
    print()
    print(fmt.commands([
        ('journal work end "<the same words>"', "close it"),
        ('journal work update "<where it got to>"', "say where it got to"),
    ]))
    return 0


def _now() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def cmd_start(subject: str) -> int:
    ok, msg = work.start(root(), subject, _now(), _where())
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
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
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    if ok:
        closed = todo.close_titled(root(), tracks.current(root(), _stem()), subject, _now())
        if closed:
            print(f"  to-do {closed} is done with it.")
        print('  did that teach anything a later reader would get wrong without?\n'
              '    journal pin "<the claim, in one line>"   (or nothing, which is fine)')
    return 0 if ok else 1


def cmd_update(text: str, on: str | None) -> int:
    ok, msg = work.note(root(), text, _now(), on)
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


PAGE = 25


def cmd_search(term: str, all_of_them: bool = False, width: int = 88, page: int = 1) -> int:
    """Every line mentioning the term on this track, across every session of the project.

    A TRACK HAS A TRANSCRIPT — everything said while it was current, in every session —
    and that is what is searched, because a ruling made on this track last week is as
    much this track's as one made an hour ago. `--all` searches every track. The line
    number is the citation and leads, with the session it belongs to; the passage is a
    window around the first mention, wrapped, with the term marked so the eye lands on it.
    """
    import textwrap
    from pins import age
    conf, problems = settings_mod.load(root())
    for pr in problems:
        print(f"  ! {pr}", file=sys.stderr)
    here = tracks.current(root(), _stem())
    needle = term.lower()
    found: list[tuple[Path, list]] = []
    total = 0
    # ONLY THE SESSIONS THAT CARRIED THIS TRACK, from the index — plus any session the
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
    scope = "every track, every session" if all_of_them else f"track {here}, every session"
    if not total:
        print(fmt.title(f"NOTHING MENTIONS {term!r}", sub=scope))
        print()
        print(fmt.wrap("The record does not have it. Say so rather than filling the gap."))
        if not all_of_them:
            print(fmt.commands([(f"journal search {term} --all", "every track")]))
        return 0
    # A PAGE AT A TIME. A common term in a long track has hundreds of mentions, and the
    # reader is an agent whose window this lands in. Newest first, because a decision is
    # more likely recent than old, and a page number for the rest.
    pages = max(1, -(-total // PAGE))
    page = min(max(1, page), pages)
    lo, hi = (page - 1) * PAGE, page * PAGE
    sub = scope + (f" · page {page} of {pages}, newest first" if pages > 1 else "")
    print(fmt.title(f"{total} LINE(S) MENTION {term!r}", sub=sub))
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
        print(fmt.section(label + (f", {when}" if when else "")))
        for l in take:
            who = "USER" if l.kind == "human" else "agent"
            print(f"  {l.n:>5}  {who}")
            body = " ".join(tags.strip(l.text).split())
            i = body.lower().find(needle)
            lo, hi = max(0, i - 140), min(len(body), i + len(term) + 200)
            snippet = body[lo:hi]
            j = snippet.lower().find(needle)
            if j >= 0:
                snippet = snippet[:j] + "«" + snippet[j:j + len(term)] + "»" + snippet[j + len(term):]
            snippet = ("…" if lo else "") + snippet + ("…" if hi < len(body) else "")
            print(textwrap.fill(snippet, width=width, initial_indent="         ",
                                subsequent_indent="         "))
            print()
    rows = []
    if page < pages:
        rows.append((f"journal search {term} --page={page + 1}", f"the next {min(PAGE, total - hi)} of {total}, older"))
    rows.append(("journal conversation --back=N", "reads a whole stretch of this session"))
    print(fmt.wrap("A line number is a citation within its session."))
    print(fmt.commands(rows))
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
            print(f"  ! --doc: {err}", file=sys.stderr)
            return None
        where["doc"] = doc_ref
    return where


def cmd_remember(fact: str, supersedes: int | None, doc_ref: str = "") -> int:
    conf, _ = settings_mod.load(root())
    where = _doc_where(doc_ref)
    if where is None:
        return 1
    ok, msg = pins.add(root(), fact, _now(), conf["pin_max_chars"], supersedes, where)
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
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
        print('nothing wants a reason: journal nothing "<why nothing here needs pinning>"',
              file=sys.stderr)
        return 1
    if _decided("declined: " + why):
        print(f"noted — nothing pinned at this rung, because: {why}")
        return 0
    print("no pin is due — no context warning is waiting on a decision", file=sys.stderr)
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
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_rules(all_of_them: bool, n: int | None, full: bool) -> int:
    if n is not None and full:
        conf, _ = settings_mod.load(root())
        ok, body = pins.around(root(), n, project(), conf["pin_context"], key=pins.RULES)
        print(body if ok else f"  ! {body}", file=sys.stdout if ok else sys.stderr)
        return 0 if ok else 1
    live = len(pins.live(root(), pins.RULES))
    struck = len(pins._all(root(), pins.RULES)) - live
    sub = f"{live} in force, on every track" + (
        f" · {struck} struck" + ("" if all_of_them else " (--all shows them)") if struck else "")
    print(fmt.title("RULES OF THIS PROJECT", sub=sub))
    print()
    print(pins.render(root(), all_of_them=all_of_them, key=pins.RULES))
    print()
    print(fmt.wrap("Handed first to every session and to every subagent."))
    print(fmt.commands([
        ("journal rules <n> --full", "the conversation around one"),
        ('journal rule --strike <n> "<why>"', "repeal one"),
    ]))
    return 0


def cmd_promote(n: int) -> int:
    ok, msg = pins.promote(root(), n, _now(), _where())
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_todo(rest: list[str], all_of_them: bool, brief: bool = False, doc_ref: str = "") -> int:
    here = tracks.current(root(), _stem())
    if not rest:
        waiting = todo.open_items(root(), here)
        done = len(todo._all(root(), here)) - len(waiting)
        draining = todo.auto(root(), here)
        sub = f"track {here} · {len(waiting)} waiting" + (
            f" · {done} done" + ("" if all_of_them else " (--all shows them)") if done else "") + (
            " · auto ON" if draining else "")
        print(fmt.title("TO-DO", sub=sub))
        print()
        print(todo.render(root(), here, all_of_them=all_of_them))
        print()
        print(fmt.wrap("Auto is on: with nothing open, the agent picks up the next one on its own."
                       if draining else
                       "Delayed work on this track, listed at every session start. Not an "
                       "instruction to start one."))
        print(fmt.commands([
            ("journal todo <n>", "the brief, and the question if it waits on the user"),
            ("journal todo start <n>", "pick one up"),
            ('journal todo "<title>" --brief', "add one, with a brief on stdin"),
            ('journal todo answer <n> "<answer>"', "answer one that waits on you"),
            ("journal todo auto " + ("off" if draining else "on"),
             "stop working through the list on your own" if draining else "work through the list without asking"),
        ]))
        return 0
    verb = rest[0]
    if verb == "auto":
        if len(rest) < 2:
            print(f"auto is {'ON' if todo.auto(root(), here) else 'OFF'} for `{here}`. "
                  "`journal todo auto on|off` sets it.")
            return 0
        want = rest[1].lower()
        if want not in ("on", "off", "true", "false", "yes", "no"):
            print(f"auto wants on or off, got {rest[1]!r}", file=sys.stderr)
            return 1
        on = want in ("on", "true", "yes")
        print(todo.set_auto(root(), here, on))
        standing = work.open_work(root())
        waiting = todo.open_items(root(), here)
        if on:
            if standing:
                print("  Agent currently working on: " + "; ".join(w["subject"] for w in standing))
                print(f"  {len(waiting)} to-do(s) waiting; the first is picked up when that work ends.")
            elif waiting:
                print(f"  Nothing is open, {len(waiting)} to-do(s) waiting: the next idle stop starts "
                      f"to-do {waiting[0]['n']}, {waiting[0]['title']}.")
            else:
                print("  Nothing is open and nothing is waiting.")
        return 0
    if verb in ("start", "done", "drop", "ask", "answer"):
        if len(rest) < 2 or not rest[1].isdigit():
            print(f'todo {verb} wants a number: journal todo {verb} 3' + (
                ' "<how>"' if verb != "start" else ""), file=sys.stderr)
            return 1
        n = int(rest[1])
        if verb in ("ask", "answer"):
            fn = todo.ask if verb == "ask" else todo.answer
            ok, msg = fn(root(), here, n, " ".join(rest[2:]))
            print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
            return 0 if ok else 1
        if verb == "start":
            t, err = todo.start(root(), here, n, _now())
            if t is None:
                print(f"  ! {err}", file=sys.stderr)
                return 1
            ok, msg = work.start(root(), t["title"], _now(), _where())
            print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
            if ok:
                print(f"  to-do {n} is started; `journal work end \"{t['title']}\"` closes both.")
            return 0 if ok else 1
        why = " ".join(rest[2:])
        if verb == "drop":
            if not why.strip():
                print('say why: journal todo drop <n> "<why it is abandoned>"', file=sys.stderr)
                return 1
            why = "dropped: " + why
        ok, msg = todo.done(root(), here, n, why, _now())
        print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
        return 0 if ok else 1
    if verb.isdigit():
        ok, body = todo.show(root(), here, int(verb))
        print(body if ok else f"  ! {body}", file=sys.stdout if ok else sys.stderr)
        return 0 if ok else 1
    # adding: the title is the words; the brief comes on stdin ONLY when asked for with
    # --brief. Reading stdin whenever it is not a terminal hung under a test runner whose
    # stdin never closed, and a command that can hang is worse than one that asks.
    title = " ".join(rest)
    body = sys.stdin.read() if brief else ""
    where = _doc_where(doc_ref)
    if where is None:
        return 1
    ok, msg = todo.add(root(), here, title, body, _now(), where)
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_docs(rest: list[str], brief: bool, abstract: str, page: int) -> int:
    here = tracks.current(root(), _stem())
    body = sys.stdin.read() if brief else ""
    if not rest:
        cat = docs._load(root())
        drafts = len([d for d in cat if d.get("status") != "final"])
        loose = docs.uncatalogued(root())
        sub = f"{len(cat)} catalogued" + (f" · {drafts} draft(s)" if drafts else "")
        print(fmt.title("DOCS OF THIS PROJECT", sub=sub))
        print()
        print(docs.catalogue(root()))
        if loose:
            print()
            print(fmt.wrap(f"{len(loose)} file(s) under {docs.folder(root()).name}/ are not catalogued: "
                           + ", ".join(x.name for x in loose)))
        print()
        print(fmt.commands([
            ("journal docs <n>", "read one; <n>.<p> reads one part"),
            ('journal docs add "<title>" --abstract "<one line>" --brief', "a new doc, its intro on stdin"),
            ('journal docs part <n> "<title>" --brief', "a new part of doc n, from stdin"),
            ("journal docs search <term>", "every line of every doc mentioning it"),
        ] + ([("journal docs index", "catalogue the loose files")] if loose else [])))
        return 0
    verb = rest[0]
    if verb == "add":
        ok, msg = docs.add(root(), " ".join(rest[1:]), abstract, body, here)
    elif verb == "part":
        if len(rest) < 3:
            print('docs part wants a doc number and a title: journal docs part 4 "<title>" --brief', file=sys.stderr)
            return 1
        ok, msg = docs.part(root(), rest[1], " ".join(rest[2:]), body, here)
    elif verb == "replace":
        if len(rest) < 2:
            print("docs replace wants a part, like 4.2", file=sys.stderr)
            return 1
        ok, msg = docs.replace(root(), rest[1], body, here)
    elif verb == "strike":
        if len(rest) < 3:
            print('docs strike wants a part and why: journal docs strike 4.2 "<why>"', file=sys.stderr)
            return 1
        ok, msg = docs.strike(root(), rest[1], " ".join(rest[2:]))
    elif verb in ("final", "draft"):
        if len(rest) < 2:
            print(f"docs {verb} wants a doc number", file=sys.stderr)
            return 1
        ok, msg = docs.set_status(root(), rest[1], verb)
    elif verb == "abstract":
        if len(rest) < 3:
            print('docs abstract wants a doc number and the line: journal docs abstract 4 "<one line>"', file=sys.stderr)
            return 1
        ok, msg = docs.set_abstract(root(), rest[1], " ".join(rest[2:]))
    elif verb == "supersede":
        if len(rest) < 4 or rest[2] != "by":
            print("journal docs supersede <old> by <new>", file=sys.stderr)
            return 1
        ok, msg = docs.supersede(root(), rest[1], rest[3])
    elif verb == "index":
        for line in docs.adopt(root(), here):
            print(line)
        return 0
    elif verb == "search":
        return cmd_docs_search(" ".join(rest[1:]), page)
    else:
        ok, msg = docs.show(root(), verb)
        print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
        return 0 if ok else 1
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_tools(rest: list[str], brief: bool, meta: dict) -> int:
    here = tracks.current(root(), _stem())
    if not rest:
        cat = tools._all(root())
        loose = tools.uncatalogued(root())
        print(fmt.title("TOOLS OF THIS PROJECT", sub=f"{len(cat)} catalogued"))
        print()
        print(tools.catalogue(root()))
        if loose:
            print()
            print(fmt.wrap(f"{len(loose)} folder(s) under .journal/tools/ have no tool.md: "
                           + ", ".join(x.name for x in loose) + " — `journal tools index` catalogues them."))
        print()
        print(fmt.commands([
            ("journal tools <name>", "read one"),
            ("journal tools run <name> …", "run it from the project root"),
            ('journal tools add <name> "<title>" --summary="…" --usage="…" --entry=<file>', "catalogue a script"),
        ]))
        return 0
    verb = rest[0]
    if verb == "add":
        if len(rest) < 3:
            print('journal tools add <name> "<title>" --summary="<one line>" --usage="<how to call it>" [--entry=<file>] [--brief]',
                  file=sys.stderr)
            return 1
        body = sys.stdin.read() if brief else ""
        ok, msg = tools.add(root(), rest[1], " ".join(rest[2:]), meta.get("summary", ""), meta.get("usage", ""),
                            meta.get("when", ""), meta.get("entry", ""), body, here)
    elif verb == "set":
        if len(rest) < 4:
            print('journal tools set <name> summary|usage|when|entry "<value>"', file=sys.stderr)
            return 1
        ok, msg = tools.set_field(root(), rest[1], rest[2], " ".join(rest[3:]))
    elif verb == "remove":
        if len(rest) < 3:
            print('journal tools remove <name> "<why>"', file=sys.stderr)
            return 1
        ok, msg = tools.remove(root(), rest[1], " ".join(rest[2:]))
    elif verb == "index":
        for line in tools.adopt(root(), here):
            print(line)
        return 0
    elif verb == "run":
        print("journal tools run <name> [args…]", file=sys.stderr)
        return 1
    else:
        ok, msg = tools.show(root(), verb)
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_docs_search(term: str, page: int = 1, width: int = 88) -> int:
    import textwrap
    needle = term.lower()
    if not needle:
        print("docs search wants a term", file=sys.stderr)
        return 1
    hits = [(ref, title, i, line) for ref, title, i, line in docs.search_lines(root())
            if needle in line.lower()]
    if not hits:
        print(fmt.title(f"NO DOC MENTIONS {term!r}"))
        print(fmt.commands([(f"journal search {term}", "the transcript instead")]))
        return 0
    pages = max(1, -(-len(hits) // PAGE))
    page = min(max(1, page), pages)
    lo, hi = (page - 1) * PAGE, page * PAGE
    print(fmt.title(f"{len(hits)} DOC LINE(S) MENTION {term!r}",
                    sub=f"page {page} of {pages}" if pages > 1 else ""))
    last = None
    for ref, title, i, line in hits[lo:hi]:
        if ref != last:
            print(fmt.section(f"doc {ref}  {title}"))
            last = ref
        body = " ".join(line.split())
        j = body.lower().find(needle)
        body = body[:j] + "«" + body[j:j + len(term)] + "»" + body[j + len(term):]
        print(textwrap.fill(body, width=width, initial_indent=f"  {i:>4}  ", subsequent_indent="        "))
    print()
    rows = [("journal docs <n>", "read the doc")]
    if page < pages:
        rows.insert(0, (f"journal docs search {term} --page={page + 1}", f"the next {min(PAGE, len(hits) - hi)}"))
    print(fmt.commands(rows))
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
        print(held)
        return 0
    standing = work.open_work(root())
    if standing:
        print("Open work: " + "; ".join(w["subject"] for w in standing))
        print("Carry on with it; `journal work end \"<the same words>\"` when it is done.")
        return 0
    if todo.auto(root(), here):
        ready = todo.ready(root(), here)
        if ready:
            t = ready[0]
            print(f"Auto mode is on and nothing is open. Next: to-do {t['n']}, {t['title']}")
            print(f"  journal todo {t['n']}          the brief")
            print(f"  journal todo start {t['n']}    pick it up")
            return 0
        blocked = todo.asking(root(), here)
        if blocked:
            print(f"Nothing to pick up: {len(blocked)} to-do(s) wait on the user's answer. "
                  "Stop the loop if one is running; `journal todo` shows the questions.")
        else:
            print("The list is empty. Stop the loop if one is running.")
        return 0
    waiting = todo.open_items(root(), here)
    print(f"Nothing is open. {len(waiting)} to-do(s) waiting; auto is off, so none starts "
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
    print(hook.carried("startup" if fresh else "compact"))
    return 0


def cmd_tracks() -> int:
    rows = tracks.listing(root(), _stem())
    print(fmt.title("TRACKS", sub="* this session · > where new sessions start"))
    print()
    for t in rows:
        mark = ("*" if t["current"] else " ") + (">" if t["start"] else " ")
        who = ("   sessions: " + ", ".join(sid[:8] for sid in t["sessions"])) if t["sessions"] else ""
        print(f" {mark} {t['name']:<28} {t['pins']} pin(s), {t['open']} open{who}")
    print()
    print(fmt.commands([
        ('journal switch "<name>"', "this session onto that track (from a terminal: the project's start track)"),
        ('journal switch "<name>" --project', "this session, and where new sessions start"),
        ('journal switch "<name>" --session=<id>', "move one bound session; --all-sessions moves every one"),
        ("journal switch --back", "the one you came from"),
    ]))
    print(fmt.wrap("Nothing is ever closed by switching."))
    return 0


def cmd_switch(name: str, go_back: bool, project_too: bool = False, sessions: list[str] | None = None,
               all_sessions: bool = False) -> int:
    stem = _stem() or ""
    if all_sessions or sessions:
        ok, msg = tracks.switch(root(), name, _now(), "", project=True) if not go_back else (False, "--back takes no sessions")
        if not ok and "already on" not in msg:
            print(f"  ! {msg}", file=sys.stderr)
            return 1
        moved = tracks.move_sessions(root(), name, None if all_sessions else sessions)
        print(f"the project starts on {name}; moved {len(moved)} session(s): " + ", ".join(m[:8] for m in moved))
        return 0
    ok, msg = (tracks.back(root(), _now(), stem) if go_back
               else tracks.switch(root(), name, _now(), stem, project=project_too or not stem))
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_strike(n: int, why: str) -> int:
    ok, msg = pins.strike(root(), n, why)
    print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_pin_full(n: int) -> int:
    conf, _ = settings_mod.load(root())
    ok, body = pins.around(root(), n, project(), conf["pin_context"])
    print(body if ok else f"  ! {body}", file=sys.stdout if ok else sys.stderr)
    return 0 if ok else 1


def cmd_pins(all_of_them: bool) -> int:
    conf, _ = settings_mod.load(root())
    here = tracks.current(root(), _stem())
    n = len(pins.live(root()))
    struck = len(pins._all(root())) - n
    sub = f"track {here} · {n} standing" + (
        f" · {struck} struck" + ("" if all_of_them else " (--all shows them)") if struck else "")
    print(fmt.title("PINS", sub=sub))
    print()
    print(pins.render(root(), all_of_them=all_of_them))
    print()
    print(fmt.wrap("Handed to every session on this track."))
    print(fmt.commands([
        ("journal pins <n> --full", "the conversation around one"),
        ("journal promote <n>", "make one a rule for every track"),
        ('journal strike <n> "<why>"', "retire one that stopped being true"),
    ]))
    got = transcript.session_transcript(project())
    if got:
        import state as _st
        read = context.pressure(got[0], conf["context_window"], _st.get(root(), "window", 0) or 0)
        if read and read[3]:
            print(fmt.wrap(f"Context {read[0]:.0%} full ({read[1]:,} of {read[2]:,})."))
        elif read:
            print(fmt.wrap(f"Context: {read[1]:,} tokens; the window is learned at the first "
                           "compaction, or set context_window in .journal/settings.json."))
    return 0


def cmd_settings() -> int:
    conf, problems = settings_mod.load(root())
    f = root() / settings_mod.PATH
    print(fmt.title("SETTINGS", sub=str(f) if f.is_file() else "no file, every default in force"))
    print()
    for key, default in settings_mod.DEFAULTS.items():
        mark = " " if conf[key] == default else "*"
        print(f" {mark} {key:<24} {str(conf[key]):<22} {fmt.dim('default ' + str(default))}")
    if any(conf[k] != settings_mod.DEFAULTS[k] for k in settings_mod.DEFAULTS):
        print()
        print(fmt.wrap("* set in settings.json"))
    for p in problems:
        print(f"\n  ! {p}")
    return 1 if problems else 0


def main(argv: list[str]) -> int:
    back = 0
    supersedes = None
    all_of_them = False
    go_back = False
    fresh = False
    full = False
    on = None
    strike_n = None
    brief = False
    project_too = False
    all_sessions = False
    sessions: list[str] = []
    page = 1
    abstract = ""
    doc_ref = ""
    tool_meta = {}
    rest = []
    # HELP WORKS AFTER ANY VERB, and an unknown option is refused rather than kept as
    # words. `journal todo --help` used to add a to-do titled "--help": help was only
    # recognised as the first word, and anything else starting with `--` fell through
    # into the text. A flag nobody declared is a typo, and a typo filed as a title is a
    # write that reports success and lands wrong.
    if len(argv) >= 3 and argv[0] == "tools" and argv[1] == "run":
        return tools.run(root(), argv[2], argv[3:])
    if any(a in ("-h", "--help", "help") for a in argv):
        verb = next((a for a in argv if not a.startswith("-") and a != "help"), "")
        return _help(verb)
    for a in argv:
        if a.startswith("--back="):
            try:
                back = int(a.split("=", 1)[1])
            except ValueError:
                print(f"--back wants a number, got {a.split('=', 1)[1]!r}", file=sys.stderr)
                return 1
        elif a.startswith("--supersedes="):
            try:
                supersedes = int(a.split("=", 1)[1])
            except ValueError:
                print("--supersedes wants a pin number; `journal pins` numbers them", file=sys.stderr)
                return 1
        elif a.startswith("--on="):
            on = a.split("=", 1)[1]
        elif a == "--strike":
            strike_n = -1  # the number follows as the next word
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
                print("--page wants a number", file=sys.stderr)
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
            print(f"unknown option {a!r}. `journal help` lists the commands and their options.",
                  file=sys.stderr)
            return 1
        else:
            rest.append(a)
    verb = rest[0] if rest else ""
    if verb == "user":
        return cmd_user(back)
    if verb == "open":
        return cmd_open()
    if verb == "search":
        if len(rest) < 2:
            print("search wants a term", file=sys.stderr)
            return 1
        return cmd_search(" ".join(rest[1:]), all_of_them, page=page)
    if verb in ("pin", "remember"):
        if len(rest) < 2:
            print("pin wants the claim, in one line", file=sys.stderr)
            return 1
        return cmd_remember(" ".join(rest[1:]), supersedes, doc_ref)
    if verb == "nothing":
        return cmd_nothing(" ".join(rest[1:]))
    if verb == "rule":
        if strike_n is not None:
            if len(rest) < 3:
                print('rule --strike wants a number and why: journal rule --strike 2 "<why>"',
                      file=sys.stderr)
                return 1
            try:
                return cmd_rule("", int(rest[1]), " ".join(rest[2:]))
            except ValueError:
                print(f"rule --strike wants a NUMBER, got {rest[1]!r}. `journal rules` numbers them.",
                      file=sys.stderr)
                return 1
        if len(rest) < 2:
            print("rule wants the ruling, in one line", file=sys.stderr)
            return 1
        return cmd_rule(" ".join(rest[1:]), None, "", doc_ref)
    if verb == "rules":
        n = None
        if len(rest) > 1:
            try:
                n = int(rest[1])
            except ValueError:
                print(f"rules wants a NUMBER with --full, got {rest[1]!r}", file=sys.stderr)
                return 1
        return cmd_rules(all_of_them, n, full)
    if verb == "promote":
        if len(rest) < 2:
            print("promote wants a pin number: journal promote 3", file=sys.stderr)
            return 1
        try:
            return cmd_promote(int(rest[1]))
        except ValueError:
            print(f"promote wants a pin NUMBER, got {rest[1]!r}. `journal pins` numbers them.",
                  file=sys.stderr)
            return 1
    if verb == "todo":
        return cmd_todo(rest[1:], all_of_them, brief, doc_ref)
    if verb == "docs":
        return cmd_docs(rest[1:], brief, abstract, page)
    if verb == "tools":
        return cmd_tools(rest[1:], brief, tool_meta)
    if verb == "carry":
        return cmd_carry(fresh)
    if verb == "tracks":
        return cmd_tracks()
    if verb == "switch":
        return cmd_switch(" ".join(rest[1:]), go_back, project_too, sessions or None, all_sessions)
    if verb == "strike":
        if len(rest) < 3:
            print('strike wants a pin number and why: journal strike 6 "<why>"',
                  file=sys.stderr)
            return 1
        try:
            n = int(rest[1])
        except ValueError:
            print(f"strike wants a pin NUMBER, got {rest[1]!r}. `journal pins` numbers them.",
                  file=sys.stderr)
            return 1
        return cmd_strike(n, " ".join(rest[2:]))
    if verb == "pins":
        if len(rest) > 1 and full:
            try:
                return cmd_pin_full(int(rest[1]))
            except ValueError:
                print(f"pins wants a NUMBER with --full, got {rest[1]!r}", file=sys.stderr)
                return 1
        return cmd_pins(all_of_them)
    if verb == "update" and len(rest) > 1:
        # `journal update` upgrades the journal; a note on the work is `journal work update`
        print('journal update upgrades the journal. Progress on the open work is:\n'
              '  journal work update "<what moved>"', file=sys.stderr)
        return 1
    if verb == "work":
        sub = rest[1] if len(rest) > 1 else ""
        if sub not in ("start", "end", "update"):
            print('journal work start|update|end "<words>"', file=sys.stderr)
            return 1
        if len(rest) < 3:
            print(f'work {sub} wants the words: journal work {sub} "<the work>"', file=sys.stderr)
            return 1
        words = " ".join(rest[2:])
        if sub == "update":
            return cmd_update(words, on)
        return cmd_start(words) if sub == "start" else cmd_end(words)
    if verb in ("start", "end"):
        # kept so a session that learned the old spelling is not stranded mid-work
        if len(rest) < 2:
            print(f"{verb} wants the words that name the work", file=sys.stderr)
            return 1
        subject = " ".join(rest[1:])
        return cmd_start(subject) if verb == "start" else cmd_end(subject)
    if verb == "verify":
        body, ok = verify.render(root())
        print(body)
        return 0 if ok else 1
    if verb == "settings":
        return cmd_settings()
    if verb == "worktree":
        if len(rest) > 1 and rest[1] == "link":
            ok, msg = _wt.link(Path(__file__).parent if Path(__file__).parent.is_symlink()
                               else Path(__file__).resolve().parent)
            print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
            return 0 if ok else 1
        main = _wt.main_root(project())
        print(f"a linked worktree of {main}; .journal " + ("is a symlink to its journal" if (project() / ".journal").is_symlink() else "is a COPY — `journal worktree link` fixes that")
              if main else "not a linked worktree")
        return 0
    if verb == "next":
        return cmd_next()
    if verb == "version":
        have = update.current(root())
        got = update.check(root(), force=True)
        print(fmt.title(f"AGENT-JOURNAL {have}"))
        if got.get("version") and update.newer(got["version"], have):
            print(fmt.wrap(f"{got['version']} is available" + (f": {got['headline']}" if got.get("headline") else "")))
            print(fmt.commands([("journal upgrade", "pull it, tests first, and print what changed")]))
        elif got.get("version"):
            print(fmt.wrap("This is the latest."))
        else:
            print(fmt.wrap("Could not reach the repository to check for a newer one."))
        return 0
    if verb in ("upgrade", "update"):
        src = next((a.split("=", 1)[1] for a in argv if a.startswith("--from=")), None)
        ok, msg = update.upgrade(root(), src)
        print(msg if ok else f"  ! {msg}", file=sys.stdout if ok else sys.stderr)
        return 0 if ok else 1
    if verb == "conversation":
        return cmd_read(back)
    if verb:
        print(f"No such command: {verb}\n", file=sys.stderr)
        print(__doc__, file=sys.stderr)
        return 1
    # `journal --back=1` alone still reads: the block and the skill said it for a day,
    # and a reader with the old words in mind must not land on a status page instead.
    return cmd_read(back) if any(a.startswith("--back") for a in argv) else cmd_status()


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
