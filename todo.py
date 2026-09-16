#: WHAT A TO-DO IS, IN PRIORITY ORDER, AND WHY THAT ORDER. Each row is a state and the
#: predicate that puts a to-do in it; the FIRST match wins. The order is load-bearing and
#: says so — a first draft of this table claimed the predicates could not overlap, and 237
#: of the 256 field combinations do. `blocked` and `started` are both true of a row that was
#: picked up and then set aside, and that is not a defect: what a reader needs is why it is
#: not moving NOW, which is the later fact.
#:
#: SO THE ORDER IS THE ANSWER TO ONE QUESTION, asked top to bottom: what is the most recent
#: thing that decides what happens to this row next?
#:
#:   done      it is over, and nothing below can change that
#:   answered  the user has spoken and nobody has picked it up — the most actionable row
#:             there is, which is why it outranks everything but being finished
#:   asks      nobody can move it: a question with no answer, and not picked up anyway
#:   reported  an agent says it is finished and only the parent may close it
#:   assigned  held for a live agent; nobody else may take it
#:   blocked   set aside on a condition the agent will re-judge
#:   after     a prerequisite has not landed
#:   started   in flight
#:   waiting   none of the above
#:
#: `asks` WAS HISTORY BEING READ AS STATE, and that was the bug. `ask()` records the question
#: and `answer()` the reply, and neither is ever cleared — correctly: the exchange is the
#: record of why this row is what it is. But the ladder tested `t["asks"]` bare, so any to-do
#: that had EVER been asked a question shadowed every state below it. A row could be picked
#: up, worked, and reported finished while still printing "waits on the user", for the rest
#: of the project. Found by a dogfood agent folding this listing into the shared one, which
#: preserved the behaviour and reported it rather than fixing it silently.
#:
#: The predicate is precise now instead of the order being clever: waiting on the user means
#: a question with NO answer and nobody has picked it up. Starting such a row is an agent
#: saying it will proceed without one, which is legitimate and used to be invisible.
"""Delayed work — what the agent should remember TO DO. Not a rule, not a pin, not in flight.

A pin is a claim, a rule binds, open work is in flight. None of them holds "do this later",
and a piece of work that is only remembered in a summary is a piece of work that is
forgotten at the next compaction. So a to-do is written down, and it is written as a FILE:
a to-do is a brief, not a claim, and when it is picked up in a week the reader needs what,
why and where to start, which is longer than one line. A file can be edited by hand and
read in a diff.

SCOPED TO THE ENVIRONMENT. A to-do belongs to the line of work that deferred it, and one environment's
debts do not bleed into another's: `todo/<environment>/NNN-<slug>.md`. The number is the file's,
stable for the life of the to-do, so "to-do 3" means the same thing after 2 is done.

SAID, NEVER HELD, AND NOT AT EVERY STOP. An idle agent told "three to-dos are waiting"
will start one; whether it should is the user's call. The line says so, and it is said once
per transcript and again only when the list has changed — a reminder at every idle stop is
wallpaper within the hour.
"""
from __future__ import annotations

import contextlib
import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import fmt
import state
from templates import render as fill

DIR = "todo"
STRUCK = "struck"
FIELDS = ("title", "track", "at", "session", "line", "started", "done", "how",
          "blocked", "after", "assigned", "reported", "by", "doc", "transcript", "reopened", "moved_from",
          "priority", "suggestion", "closed_by", "struck")

MESSAGES = {
    "from_messages": "from the user's message {ns:, }",
    "already_done": "to-do {n} is already done ({how})",
    "already_closed": "to-do {n} is already closed ({how})",
    "assigned_nobody": "to-do {n} is assigned to nobody",
    "unassigned": "to-do {n} is back on the list; it was held by `{was}`",
    "held_by_other": "to-do {n} is held by `{held}` — one agent works a row. `journal assign {n} --off` takes it back first.",
    "assigned": "to-do {n} is assigned to `{agent}`: {title}\n"
                "  it is theirs while they are writing; nobody else may take or complete it",
    "report_how": 'say how it was finished: `journal todos report {n} "<how>"`',
    "report_not_yours": "to-do {n} is not assigned to you — it is held by `{held}`. Report what you found instead.",
    "report_nobody": "to-do {n} is held by nobody, so there is nothing of yours to report. "
                     "`journal todos start {n} --as={agent}` claims it and starts it.",
    "reported": "to-do {n} is reported finished: {how}\n  the agent that dispatched you closes it; you are done with this row",
    "priority_empty": "say a number or a level: journal todos priority <n> <50|low|medium|high|100|...>",
    "priority_bad": "priority wants a number or one of {levels:, }, got {word}",
    "priority_named": "{name} ({value})",
    "priority_set": "to-do {n} is priority {label}",
    "answer_empty": 'say the answer: journal todos answer <n> "<the answer>"',
    "answer_no_question": "to-do {n} is not waiting on a question; `journal todos start {n}` picks it up",
    "answer_many": "to-do {n} waits on {count} questions ({numbers:, }); "
                   'answer each with journal questions answer <n> "<the answer>"',
    "answered": "answered to-do {n}: {title}\n  the agent is told at its next stop and picks it up first",
    "ask_empty": 'say what the user must decide: journal todos ask <n> "<the question>"',
    "ask_link": "todo {n}",
    "asked": "to-do {n} waits on the user: {question}\n  {msg}",
    "block_empty": 'say what it waits on: `journal todos block <n> "<what has to be true first>"` — a skipped row with no reason reads as a gap',
    "blocked": "to-do {n} is set aside: {why}\n"
               "  the list skips it and `journal next` will not offer it; `journal todos start {n}` picks it up when the condition is true",
    "after_none": "to-do {n} waits on nothing now",
    "after_number": "a prerequisite is a to-do number: `journal todos after {n} 12,14`",
    "after_missing": "no to-do on `{track}` is numbered {missing:, }; `journal todos` numbers them",
    "after_self": "to-do {n} cannot wait on itself",
    "after_cycle": "that is a cycle: {path: → } — a list where each waits on the next can never be worked",
    "after_set": "to-do {n} waits on {nums:, }{tail}",
    "after_plan": "plan {p}",
    "fact_plan": "plan {n}, phase {p}",
    "after_plan_missing": "there is no plan {p} on `{track}`",
    "after_plan_left": "; plan {p} is not finished yet, and it becomes ready when that plan is done",
    "mentions": "\n  the brief mentions {refs:, } and this row records no dependency. If it must wait for "
                "{them}, say so:\n    journal todos after {n} {args}",
    "after_left": "; {left} still open, and it becomes ready when the last one closes",
    "after_ready": " — all of them are done, so it is ready now",
    "not_aside": "to-do {n} is not set aside",
    "unblocked": "to-do {n} is back on the list; it was set aside on: {was}",
    "no_such": "there is no to-do {n} on environment `{track}`. `journal todo` numbers them.",
    "add_empty": 'a to-do needs a title: journal todos add "<what, in a few words>"',
    "retitled": "to-do {n} is now titled: {title}",
    "duplicate": "to-do {n} is already on the list with that title, so nothing was added. More about it goes in its brief: "
                 "journal todos amend {n} \"<section>\" --brief. Progress on it goes in: journal work update \"<what moved>\"",
    "added": "to-do {n} on `{track}`: {title}\n  {path}",
    "cites_plan_hint": "\n  to-dos {others} cite doc {doc} too. Work in phases belongs in a plan, not a doc: "
                       "journal plans add \"<title>\" --goal=\"<one line>\" --brief, then journal plans todos <plan> <phase> <numbers>",
    "amend_title": 'amend wants a section title: journal todos amend <n> "<section title>" --brief',
    "amend_body": "amend wants a body on stdin — pass it with --brief",
    "amend_exists": 'to-do {n} already has a section called "{title}" — journal todos replace {n} "{title}" updates it',
    "amended": 'to-do {n}: added section "{title}"\n  the old brief is kept under {struck}/',
    "replace_body": "replace wants a body on stdin — pass it with --brief",
    "replaced_whole": "to-do {n}: the whole brief replaced\n  the old one is kept under {struck}/",
    "section_quoted": '"{title}"',
    "no_sections": "none — this brief has no `## ` sections yet",
    "no_section": 'to-do {n} has no section called "{title}". It has: {have}',
    "replaced": 'to-do {n}: section "{title}" replaced\n  the old brief is kept under {struck}/',
    "no_reason": "no reason recorded",
    "start_waits": "to-do {n} waits on the user: {asks} — {next}",
    "start_next": "next ready: {n} ({title})",
    "start_nothing": "nothing else is ready",
    "done_empty": 'say how it was resolved: journal todos done <n> "<how>"',
    "done": "done {n}: {title}\n  {how}",
    "move_where": 'say where: journal todos move <n> "<environment>"',
    "move_same": "to-do {n} is already on `{env}`",
    "moved": "to-do {n} on `{track}` is to-do {to} on `{env}`: {title}\n  {path}",
    "reopen_why": 'say why it is open again: journal todos reopen <n> "<why>"',
    "reopen_open": "to-do {n} is not done — nothing to reopen",
    "reopened": "reopened {n}: {title}\n  {why}\n  the close it undoes: {was}",
    "prune_empty": "say how old: journal todos prune --older-than=30d (h/d/w) or --before=<date>",
    "prune_large": "{word} is too large a span",
    "prune_bad": "{word} is not a duration (30d, 2h, 6w) or a date `journal` writes (e.g. 2026-08-01)",
    "prune_nothing": "nothing to prune — no done to-do here closed before {date}",
    "pruned_deleted": "deleted {n} done to-do(s)",
    "pruned_archived": "archived {n} done to-do(s) under {archive}/",
    "closed_its_work": "; ended the work `{title}` with it",
    "keep_usage": "journal todos keep <days>: how many days a done to-do stays listed on this environment; 0 keeps them",
    "kept": "done to-dos on `{env}` stay listed for {days} day(s), then are archived",
    "kept_always": "done to-dos on `{env}` stay listed until archived by hand",
    "pruned": "{said}, closed before {date}: {nums:, }[ …and {more} more]",
    "stays_open": "to-do {n} stays open: it is held for `{held}`, and the agent that dispatched you closes it. Your work is closed.",
    "commit_none": "to-do {n}: no environment has one — nothing closed",
    "commit_ambiguous": "to-do {n} is ambiguous — {owners:, } all have one. Spell it: {trailer} todos done <environment>/{n}",
    "commit_closed_already": "to-do {n} on `{env}` was already closed ({how}) — left as it is",
    "commit_closed": "{line} (on `{env}`)",
    "held": "held by `{agent}` ({age})",
    "started_live": "started {age}, work is open",
    "started_ended": "started {age}, but the work was ended without closing this row",
    "state_done": "done {age}: {how}",
    "state_answered": "answered by the user, not yet picked up",
    "state_asks": "waits on the user",
    "state_reported": "reported finished by `{by}` — yours to close: {how}",
    "state_blocked": "set aside: {why}",
    "state_after": "after {after}{tail}",
    "state_after_open": " — {n} still open",
    "state_after_done": ", all done: ready",
    "state_waiting": "waiting[ {age}]",
    "empty_open": "  Nothing is waiting.",
    "empty_all": "  No to-dos on this environment.",
    "fact_priority": "priority {label}",
    "fact_brief": "has a brief",
    "fact_title_only": "title only",
    "fact_doc": "→ {label}",
    "question": "? {asks}",
    "answer": "→ {answer}",
    "meta_env": "environment {env}",
    "meta_written": "written {age} ({date})",
    "meta_line": "line {line}",
    "meta_started": "started {age}",
    "meta_done": "done {age}: {how}",
    "show_title": "TO-DO {n}",
    "section_answered": "the user answered",
    "section_waiting": "waiting on the user",
    "section_brief": "brief",
    "section_log": "work log",
    "log_started": "started",
    "log_update": "update",
    "log_waiting": "waiting on",
    "log_commit": "commit",
    "log_ended": "ended",
    "log_row": "  {age:>9}  {kind:<10}  {text}",
    "section_doc_files": "files of doc {n}",
    "title_only": "  (title only; no brief was written)",
    "cmd_start": "journal todos start {n}",
    "cmd_start_what": "pick it up",
    "cmd_done": 'journal todos done {n} "<how>"',
    "cmd_done_what": "close it without starting",
    "cmd_answer": 'journal todos answer {n} "<answer>"',
    "cmd_answer_what": "answer it (the user)",
    "cmd_ask": 'journal todos ask {n} "<question>"',
    "cmd_ask_what": "it waits on the user",
    "cmd_block": 'journal todos block {n} "<what has to be true first>"',
    "cmd_block_what": "you cannot do it yet, and it is not a question for them",
    "cmd_after": "journal todos after {n} 12,14",
    "cmd_after_what": "it must follow those; it goes ready when the last one closes",
    "auto_on": "auto ON for this journal — every environment, not just this one: whenever no work is open, the agent picks up the next to-do on its own and "
               "keeps going until the list is empty.\n"
               "  START A LOOP NOW, or nothing will wake this session at its next idle stop and the list will sit "
               "where it is:\n"
               "    the `loop` skill with `15m journal next`\n"
               "  Until one is running (or `journal loop set` says one is), the next write is refused — auto "
               "without a loop is a promise nothing keeps.",
    "auto_off": "auto OFF for this journal: to-dos are listed and never started without the user's word.",
    "loop_line": "Keep a loop running while auto is on, if none is: the `loop` skill with `{m}m journal next`, so an "
                 "idle session comes back every {m} minutes and carries on until nothing is left it can do.",
    "carry_line": "  {n}  {title}",
    "carry_answered": "\n       ANSWERED by the user: {answer}\n       (the question was: {asks})",
    "carry_asks": "\n       waiting on the user: {asks}",
    "carry_lead": "{n} of these the user has ANSWERED since they were parked — pick those up first.\n",
    "carry_auto": "TO DO on this environment, {n} waiting — AUTO MODE IS ON: this list is worked through without "
                  "asking. Whenever nothing is open, pick up the next one with `journal todos start <n>`, solve it "
                  "yourself, `journal work end` it, and keep going until the list is empty. Every choice a brief "
                  "leaves open is yours: make it, write it in `journal work update`, carry on. Ask the user only "
                  "when you cannot proceed without something only they can supply, or the hook says you are "
                  "stalled — then `journal todos add ask <n> \"<what is stuck>\"` and move to the next. {loop}\n"
                  "{lead}{titles}{asking}\n`journal todos <n>` reads the brief; `journal auto-mode disable` turns this off.",
    "carry_asking": "\n{n} of these wait on the user; the questions are above. When the user answers, `journal todos start <n>`.",
    "carry_manual": "TO DO on this environment, {n} waiting — delayed work, not an instruction to start any of it. "
                    "Start one only when the user says so, or asks you to work through them (then offer `journal "
                    "auto-mode enable`). A to-do the user has ANSWERED is theirs saying to do it: start it.\n"
                    "{lead}{titles}\n`journal todos <n>` reads the brief; `journal todos start <n>` picks one up.",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def _slug(text: str, limit: int = 40) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return (s[:limit].rstrip("-") or "untitled")


def folder(root: Path, track: str) -> Path:
    """Where this environment's to-dos live: inside the environment's own folder.

    They sat in a parallel `todo/<name>/` tree, which meant "what is on this environment"
    was answered in two places that could disagree. `migrate` moves an older layout across
    on the first run after an upgrade; the old path is still read until it has, so nothing
    is invisible in between.
    """
    d = state.env_dir(root, track) / DIR
    if not d.is_dir():
        was = root / DIR / _slug(state.slug(track) or "default", 60)
        if was.is_dir():
            return was
    return d


#: path -> (mtime_ns, size, parsed). SAME SHAPE AS `state._read`, for the same reason and
#: validated the same way: another process's write changes mtime or size, so the next read
#: here misses and sees it.
#:
#: ONE COMMAND READ EVERY TO-DO FOUR TIMES. `open_items` is called by the status page, by
#: the auto check, by `answered` and by `asking`, and each one walked the whole folder and
#: re-parsed it. In a project with 1,891 rows that is 7,564 file reads for one bare
#: `journal` — 1.09 seconds of the 2.27 the command took, measured with cProfile. The
#: callers are all correct; reading the same unchanged file four times is what was wrong.
_PARSED: dict = {}


def _parse(path: Path) -> dict:
    try:
        st = path.stat()
    except OSError:
        return {"title": path.stem, "body": "", "path": path, "n": 0}
    key = str(path)
    hit = _PARSED.get(key)
    if hit is not None and hit[0] == st.st_mtime_ns and hit[1] == st.st_size:
        return dict(hit[2])
    got = _read_todo(path)
    _PARSED[key] = (st.st_mtime_ns, st.st_size, got)
    return dict(got)


def _read_todo(path: Path) -> dict:
    text = path.read_text()
    meta: dict = {"title": "", "body": "", "path": path}
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            for line in text[4:end].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            text = text[end + 4:].lstrip("\n")
    meta["body"] = text.strip()
    m = re.match(r"(\d+)-", path.name)
    meta["n"] = int(m.group(1)) if m else 0
    if not meta["title"]:
        meta["title"] = path.stem
    return meta


def _write(path: Path, meta: dict, body: str) -> None:
    """Atomic, and SAFE UNDER A CONCURRENT READER — see `state._write`, which this mirrors.

    `path.write_text` opens with truncation, then writes: a reader that lands in that
    window — a background loop's `journal next`, a hook firing on a different tool call —
    sees a short or empty file. `_read_todo` treats a front matter with no closing `---`
    as NO front matter at all, so a reader catching this row mid-write reads it as if
    `started` and `done` had never been set. Each writer gets its own tmp file, exactly
    as `state._write` does, for the same reason: two writers sharing one tmp path killed
    the loser with FileNotFoundError.
    """
    _PARSED.pop(str(path), None)
    lines = ["---"] + [f"{k}: {meta.get(k, '') or ''}" for k in FIELDS] + ["---", ""]
    if body.strip():
        lines += [body.strip(), ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=path.parent, prefix=f".{path.name}.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as fh:
            fh.write("\n".join(lines))
        os.replace(tmp, path)
    except BaseException:
        with contextlib.suppress(OSError):
            os.unlink(tmp)
        raise


#: THE LEDGER. One file holding the front matter of every row, so answering "how many are
#: open" costs one directory scan and one small read instead of 1,891 file opens. Measured in
#: a real project before it existed: a bare `journal` did 7,564 reads and spent 1.09s of a
#: 3.30s command in `_parse`.
#:
#: IT IS DERIVED, SO IT LIVES IN `runtime/` — gitignored, per project, rebuilt by whoever
#: notices. Nothing in it is the truth; the markdown files are the truth, and this is a
#: reading of them that must prove itself against them every time.
#:
#: A STALE INDEX IS DETECTED, NEVER TRUSTED BECAUSE IT IS THERE. That is the whole risk of
#: caching a store this package exists to keep honest, so the check is per FILE and not per
#: directory: one `scandir` gives every name with its mtime and size — the stat comes back
#: with the entry, so it is one syscall's worth of work, not 1,891 — and any row whose stamp
#: does not match is re-read from disk. A row edited by hand, by another process, or by a
#: `git checkout` is caught the same way, because none of them can change a file without
#: changing its mtime or its size.
#:
#: THE BODY IS NOT IN IT. A brief runs to thousands of characters and the listing never shows
#: one — it says "has a brief" — so the ledger keeps a flag and `_get` reads the single file
#: whose body somebody actually asked for.
INDEX_VERSION = 3
_LISTED: dict = {}


def _index_file(root: Path, track: str) -> Path:
    return root / state.RUNTIME_DIR / f"todo-{state.slug(track) or 'default'}.index.json"


def _stamped(d: Path) -> dict:
    """{name: [mtime_ns, size]} for every row in the folder, from ONE scandir.

    THIS IS NOT CACHED, AND THAT IS THE POINT. Caching it per process saves 0.14s of a
    one-second command and was tried: the suite caught it immediately, because a row written
    by anything that does not go through `_write` — a hand edit, a sibling process, a git
    checkout mid-command — is then invisible for the life of the process. The ledger is
    allowed to be a cache precisely because THIS re-reads the folder every time and checks
    it; caching the check as well leaves nothing checking anything.
    """
    import os
    out = {}
    try:
        with os.scandir(d) as it:
            for e in it:
                if e.name.endswith(".md") and e.is_file():
                    st = e.stat()
                    out[e.name] = [st.st_mtime_ns, st.st_size]
    except OSError:
        return {}
    return out


def _all(root: Path, track: str) -> list[dict]:
    d = folder(root, track)
    if not d.is_dir():
        return []
    key = str(d)
    now = _stamped(d)
    held = _LISTED.get(key)
    if held is None:
        held = _read_index(_index_file(root, track))
        _LISTED[key] = held
    rows, changed = {}, False
    for name, stamp in now.items():
        was = held.get(name)
        if was and was.get("stamp") == stamp:
            rows[name] = was
            continue
        # RE-READ EXACTLY WHAT MOVED. A hand edit, another session's write, a git checkout:
        # each changes an mtime or a size, and each costs one file, not the folder.
        got = _read_todo(d / name)
        rows[name] = {"stamp": stamp, "meta": {k: v for k, v in got.items()
                                               if k not in ("path", "body")},
                      "brief": bool(got["body"].strip())}
        changed = True
    if changed or len(rows) != len(held):
        _LISTED[key] = rows
        _write_index(_index_file(root, track), rows)
    out = []
    for name, row in rows.items():
        meta = dict(row["meta"])
        # BUILT ONCE AND KEPT. `d / name` for 1,891 rows, four times a command, was 8,041
        # Path constructions — more time than reading the ledger it came from.
        meta["path"] = row.get("_p") or row.setdefault("_p", d / name)
        meta["brief"] = row["brief"]
        out.append(meta)
    return _with_questions(root, track, sorted(out, key=lambda m: m["n"]))


def _with_questions(root: Path, track: str, rows: list[dict]) -> list[dict]:
    import questions
    linked: dict[int, list[dict]] = {}
    for q in questions._all(root, track):
        if q.get("withdrawn"):
            continue
        for ref in q.get("links") or []:
            kind, _, num = ref.partition(":")
            if kind == "todo" and num.isdigit():
                linked.setdefault(int(num), []).append(q)
    for t in rows:
        qs = linked.get(t["n"])
        if not qs:
            continue
        waiting = [q for q in qs if not q.get("answer")]
        t["asks"] = "; ".join(q["text"] for q in (waiting or qs[-1:]))
        t["answer"] = "" if waiting else qs[-1]["answer"]
    return rows


def _read_index(f: Path) -> dict:
    try:
        got = json.loads(f.read_text())
    except (OSError, ValueError):
        return {}
    # A LEDGER FROM AN OLDER SHAPE IS DISCARDED, NOT INTERPRETED. It is derived data; the
    # cost of throwing it away is one rebuild, and the cost of guessing at it is a wrong count
    # nobody can see is wrong.
    if not isinstance(got, dict) or got.get("v") != INDEX_VERSION:
        return {}
    rows = got.get("rows")
    return rows if isinstance(rows, dict) else {}


def _write_index(f: Path, rows: dict) -> None:
    try:
        f.parent.mkdir(parents=True, exist_ok=True)
        keep = {n: {k: v for k, v in r.items() if k != "_p"} for n, r in rows.items()}
        f.write_text(json.dumps({"v": INDEX_VERSION, "rows": keep}))
    except OSError:
        pass  # a ledger that cannot be written is a slow command, never a failed one


def all_items(root: Path, track: str) -> list[dict]:
    """Every to-do on this environment, open and done — the public entry point `_all` is
    read through."""
    return _all(root, track)


def item(root: Path, track: str, n: int) -> tuple[dict | None, str]:
    """One to-do, with its body — the public entry point `_get` is read through."""
    return _get(root, track, n)


def open_items(root: Path, track: str) -> list[dict]:
    return [t for t in _all(root, track) if not t.get("done")]


def ready(root: Path, track: str) -> list[dict]:
    """Open to-dos nothing is waiting on: what auto may pick up. Answered first.

    TWO WAYS TO BE UNREADY AND THEY ARE NOT THE SAME. `asks` waits on a PERSON — somebody
    must answer, and the list surfaces it to them. `blocked` waits on a CONDITION — a batch
    that must run together, a release, another to-do — and nobody has to do anything; the
    agent re-judges it itself when it comes round again.

    THE SECOND ONE EXISTS BECAUSE ITS ABSENCE COST A REAL SESSION. With no way to say "not
    now, because X", an agent whose reminder forbade the work the list kept offering built
    a parking-bay environment, switched to it, and silenced every reminder it had — the
    list was a wall and it went around. A wall is what an agent routes around; a skip is
    what it uses.
    """
    # A ROW HELD BY A LIVE AGENT IS NOT READY FOR ANYONE ELSE. The hold lapses on a
    # heartbeat, so a dispatch that died releases its row without anybody remembering to.
    import agents as ag
    items = [t for t in open_items(root, track)
             if (not t.get("asks") or t.get("answer")) and not t.get("blocked")
             and not t.get("reported")
             and not (t.get("assigned") and ag.active(root, track, t["assigned"], 30))
             and not waiting_on(root, track, t)
             and not waiting_on_plan(root, track, t)]
    # ANSWERED STILL OUTRANKS PRIORITY. The user replying to a question is their own
    # word to do it now — that is a stronger signal than a number nobody has looked at
    # since it was set, so it stays the first sort key. Priority decides the rest: the
    # highest-priority ready row is what auto picks up and what `journal next` names.
    # AN ACTIVE PLAN NARROWS IT: its current phase, and outside the plan only what beats the default priority
    import plans
    ranked = plans.order(root, track, items)
    return [t for _, t in sorted(ranked, key=lambda rt: (0 if answered_one(rt[1]) else 1, rt[0], -priority_of(rt[1])))]


def blocked(root: Path, track: str) -> list[dict]:
    """Open to-dos set aside on a condition, with the reason each is waiting on."""
    return [t for t in open_items(root, track) if t.get("blocked")]


def assign(root: Path, track: str, n: int, agent: str) -> tuple[bool, str]:
    """Hand a to-do to one named subagent. `--off` gives it back to the list.

    A HELD ROW IS NOT A LOCKED ONE. The hold means: while that agent is still writing, this
    is theirs to work and theirs alone. It lapses on a heartbeat rather than on a promise,
    because nothing can tell us a subagent died — see `agents.touch`.
    """
    import agents as ag
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, say("already_done", n=n, how=close_note(t))
    if agent in ("--off", "off", ""):
        was = t.get("assigned")
        if not was:
            return False, say("assigned_nobody", n=n)
        _update(root, track, n, assigned="", reported="", by="")
        return True, say("unassigned", n=n, was=was)
    agent = state.slug(agent)
    held = t.get("assigned")
    if held and held != agent:
        return False, say("held_by_other", n=n, held=held)
    _update(root, track, n, assigned=agent)
    return True, say("assigned", n=n, agent=agent, title=t["title"])


def report(root: Path, track: str, n: int, how: str, agent: str) -> tuple[bool, str]:
    """A subagent says a to-do is finished. Only the parent may CLOSE one.

    TWO PHASES, AND THE SECOND IS THE PARENT'S. A subagent that could close its own row
    would be marking its own homework — the failure this project already watched happen
    once, where a runner ticked its own box and the record read as done while a step was
    missed. So it reports, with how, and the close stays where the judgement is.
    """
    how = " ".join((how or "").split())
    if not how:
        return False, say("report_how", n=n)
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, say("already_closed", n=n, how=close_note(t))
    if state.slug(agent) != (t.get("assigned") or ""):
        held = t.get("assigned")
        return False, (say("report_not_yours", n=n, held=held) if held
                       else say("report_nobody", n=n, agent=state.slug(agent)))
    _update(root, track, n, reported=how, by=state.slug(agent))
    return True, say("reported", n=n, how=how)


def reported(root: Path, track: str) -> list[dict]:
    """Rows a subagent has finished and the parent has not yet closed."""
    return [t for t in open_items(root, track) if t.get("reported")]


#: WHAT "PRIORITY" MEANS HERE: A SCORE, NOT A RANK. Bigger is more important — the
#: user's own words for it: "everything below [the default] is less important than
#: everything above." 100 is the middle of the scale on purpose, so a to-do can be
#: pushed either more urgent (above it) or less (below it) from the same starting
#: point, the way `nice` does it in the opposite direction.
DEFAULT_PRIORITY = 100

#: NAMED LEVELS ARE SUGAR OVER THE SAME NUMBER, NOT A SEPARATE SCALE. No `medium` —
#: `default` already names the middle of the scale, and a to-do nobody has touched IS
#: that. A raw number still works for anything finer than these four words.
PRIORITY_LEVELS = {"low": 50, "default": DEFAULT_PRIORITY, "high": 150, "critical": 200}


def priority_of(t: dict) -> int:
    """This to-do's priority — `DEFAULT_PRIORITY` for one that has never had it set,
    and for a value that somehow ended up unreadable, because a broken number here
    must never crash the list that is supposed to be showing it."""
    got = t.get("priority")
    if got in (None, ""):
        return DEFAULT_PRIORITY
    try:
        return int(got)
    except (TypeError, ValueError):
        return DEFAULT_PRIORITY


def parse_priority(word: str) -> tuple[int | None, str]:
    """(the number, "") for a raw integer or a named level — or (None, the refusal)."""
    word = (word or "").strip()
    if not word:
        return None, say("priority_empty")
    named = PRIORITY_LEVELS.get(word.lower())
    if named is not None:
        return named, ""
    try:
        return int(word), ""
    except ValueError:
        return None, say("priority_bad", levels=sorted(set(PRIORITY_LEVELS) - {"default"}), word=repr(word))


def priority_label(value: int) -> str:
    """The named level this number matches, or the number itself — for the CLI to
    show a reader the word they set rather than making them recompute it."""
    for name, num in PRIORITY_LEVELS.items():
        if num == value and name != "default":
            return say("priority_named", name=name, value=value)
    return str(value)


def priority(root: Path, track: str, n: int, word: str) -> tuple[bool, str]:
    """Set a to-do's priority. `word` is a raw number or a named level (low/medium/
    high/...) — see `parse_priority`. Bigger means more important; `journal todos`
    orders by it, highest first, unless told `--order-by-id`."""
    value, err = parse_priority(word)
    if value is None:
        return False, err
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    _update(root, track, n, priority=str(value))
    return True, say("priority_set", n=n, label=priority_label(value))


def after_of(t: dict) -> list[int]:
    """The to-do numbers this one must follow, as numbers."""
    raw = (t.get("after") or "").replace(",", " ").split()
    return [int(x) for x in raw if x.isdigit()]


def after_plan(t: dict) -> int | None:
    """The plan this to-do waits for, if it waits for one.

    A PLAN IS A PREREQUISITE LIKE ANY OTHER, and it lives in the same field: a row that only
    makes sense once a whole plan has landed was written as prose before this, and prose is
    not something `ready` can read.
    """
    for token in (t.get("after") or "").replace(",", " ").split():
        if token.startswith("plan:") and token[5:].isdigit():
            return int(token[5:])
    return None


def waiting_on_plan(root: Path, track: str, t: dict) -> int | None:
    """The plan this row waits for while that plan is unfinished — None when nothing holds it.

    AN ABANDONED PLAN IS NOT A FINISHED ONE, the same way a struck to-do is not a done one:
    the row stays waiting and says which plan it waits on, rather than quietly becoming
    ready because what it depended on was dropped.
    """
    p = after_plan(t)
    if p is None:
        return None
    import plans
    items = plans._all(root, track)
    if not 1 <= p <= len(items):
        return p
    plan = items[p - 1]
    return None if plans.status(plan, plans.phases(root, plan, track)) == plans.DONE else p


def waiting_on(root: Path, track: str, t: dict, by_n: dict | None = None) -> list[int]:
    """Which of this to-do's prerequisites are not done yet — [] when it is free to start.

    A PREREQUISITE IS A `blocked` WHOSE CONDITION THE CODE CAN CHECK. `blocked` is prose the
    agent re-judges; this is a list of numbers, so when the last one closes the row becomes
    ready ON ITS OWN and nobody has to remember to release it. That is the whole reason to
    have both.

    A STRUCK PREREQUISITE IS NOT A DONE ONE. It was abandoned, not finished, so the row that
    depended on it may no longer make sense — it stays waiting and `journal todos` says which
    number it is waiting on, rather than quietly becoming ready because the blocker vanished.
    """
    # a list of many rows passes `by_n` in once; reading the folder again for every row made it quadratic
    by_n = by_n if by_n is not None else {x["n"]: x for x in _all(root, track)}
    return [n for n in after_of(t)
            if n in by_n and not (by_n[n].get("done") and not by_n[n].get("struck"))]


def asking(root: Path, track: str) -> list[dict]:
    """Open to-dos waiting on the user, each with its question, not yet answered."""
    return [t for t in open_items(root, track) if t.get("asks") and not t.get("answer")]


def answered_one(t: dict) -> bool:
    return bool(t.get("asks") and t.get("answer") and not t.get("started") and not t.get("done"))


def answered(root: Path, track: str) -> list[dict]:
    """To-dos the user has answered and nobody has picked up yet: the agent is unstuck.

    AN ANSWER DOES NOT OUTRANK THE ROW'S OWN SEQUENCING. The user's reply is their word to
    do it — but a row given `after 1717,1704` waits on those landing, and the answer does
    not close them. Measured in workflows: the hold said "the user answered to-do 1410 —
    that is their word to do it: todos start 1410" while both prerequisites were open and
    the answer's own text said the work waits behind them. `ready` already skips such a
    row; this list is what the hold and the doorway read, so it skips it too.
    """
    return [t for t in open_items(root, track) if answered_one(t) and not waiting_on(root, track, t)]


def answer(root: Path, track: str, n: int, text: str) -> tuple[bool, str]:
    """The user's answer to a to-do's question, from the terminal, on the record.

    THE OTHER HALF OF `ask`. The agent parked a question; the user reads it in `journal
    todo` and answers here without opening a session. The to-do is ready again and goes
    first: the next stop tells the agent which question was answered and what the answer
    was, and hands it that to-do before any other.
    """
    text = " ".join((text or "").split())
    if not text:
        return False, say("answer_empty")
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, say("already_done", n=n, how=close_note(t))
    import questions
    waiting = [m for m, q in questions.about(root, f"todo:{n}", track) if questions.is_open(q)]
    if not waiting:
        return False, say("answer_no_question", n=n)
    if len(waiting) > 1:
        return False, say("answer_many", n=n, count=len(waiting), numbers=waiting)
    ok, msg = questions.answer(root, waiting[0], text, now(), track=track)
    if not ok:
        return False, msg
    return True, say("answered", n=n, title=t["title"])


def ask(root: Path, track: str, n: int, question: str) -> tuple[bool, str]:
    """Mark a to-do as waiting on the user, with the question it waits on.

    THE WAY AUTO SKIPS WITHOUT FORGETTING. An agent working through a list meets a to-do
    whose brief leaves a decision only the user can make. Without this it asks, the turn
    ends, and the next hold names the same to-do again — a loop with the user as the
    exit. With it the question is on the record, the hold names the next to-do that is
    not waiting, the start block shows the user what is waiting on them, and `start`
    picks it up once they have answered.
    """
    question = " ".join((question or "").split())
    if not question:
        return False, say("ask_empty")
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, say("already_done", n=n, how=close_note(t))
    import questions
    ok, msg = questions.add(root, question, now(), [say("ask_link", n=n)], track=track)
    if not ok:
        return False, msg
    _update(root, track, n, started="")
    return True, say("asked", n=n, question=question, msg=msg)


def block(root: Path, track: str, n: int, why: str) -> tuple[bool, str]:
    """Set a to-do aside on a condition. Not done, not abandoned, not the user's problem.

    THE REASON IS REQUIRED, like every retirement here — and unlike them this one is not a
    retirement at all: the to-do stays open, stays counted, and comes back. What the reason
    buys is a later reader knowing WHY a row was skipped rather than finding a gap, and the
    agent that meets it again reading the condition at the moment it is judging whether the
    condition still holds.

    IT IS THE AGENT'S OWN JUDGEMENT, exactly like a reminder's `--until`. Nothing here can
    evaluate "the rig batch has run"; the agent wrote it, the agent reads it back, and the
    agent unblocks it. `journal todos start <n>` does that in one move, deliberately: if
    you are picking it up, the block is over.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, say("block_empty")
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, say("already_done", n=n, how=close_note(t))
    _update(root, track, n, blocked=why, started="")
    return True, say("blocked", n=n, why=why)


def after(root: Path, track: str, n: int, names: str) -> tuple[bool, str]:
    """Say which to-dos must land before this one. `--none` clears it.

    REFUSED RATHER THAN DISCOVERED. A dependency rots in ways a flat list cannot: a number
    that is not a to-do, a row waiting on itself, or a CYCLE — 12 after 14 after 12 — which
    is a list that can never be worked and whose only symptom is a `next` that returns
    nothing forever. All three are caught here, when they are written, because that is the
    only moment somebody is looking.
    """
    # `plan 4` and `plan:4` are the same thing said two ways; the rest are to-do numbers
    names = re.sub(r"(?i)\bplan[ :]+(\d+)", r"plan:\1", " ".join((names or "").replace(",", " ").split()))
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if names in ("--none", "none", ""):
        _update(root, track, n, after="")
        return True, say("after_none", n=n)
    want = names.split()
    plan = next((int(x[5:]) for x in want if x.startswith("plan:") and x[5:].isdigit()), None)
    rest = [x for x in want if not x.startswith("plan:")]
    if any(not x.isdigit() for x in rest):
        return False, say("after_number", n=n)
    nums = [int(x) for x in rest]
    by_n = {x["n"]: x for x in _all(root, track)}
    missing = [x for x in nums if x not in by_n]
    if missing:
        return False, say("after_missing", track=track, missing=missing)
    if n in nums:
        return False, say("after_self", n=n)
    cycle = _cycle(by_n, n, nums)
    if cycle:
        return False, say("after_cycle", path=cycle)
    if plan is not None:
        import plans
        if not 1 <= plan <= len(plans._all(root, track)):
            return False, say("after_plan_missing", p=plan, track=track)
    stored = ",".join([*map(str, nums), *([f"plan:{plan}"] if plan is not None else [])])
    _update(root, track, n, after=stored)
    row = {**t, "after": stored}
    left = waiting_on(root, track, row)
    held = waiting_on_plan(root, track, row)
    tail = (say("after_left", left=len(left)) if left
            else say("after_plan_left", p=held) if held else say("after_ready"))
    labels = [*map(str, nums), *([say("after_plan", p=plan)] if plan is not None else [])]
    return True, say("after_set", n=n, nums=labels, tail=tail)


def _cycle(by_n: dict, start: int, nums: list[int]) -> list[int] | None:
    """The path back to `start`, if these prerequisites would close a loop."""
    seen, stack = set(), [(x, [start, x]) for x in nums]
    while stack:
        cur, path = stack.pop()
        if cur == start:
            return path
        if cur in seen:
            continue
        seen.add(cur)
        for nxt in after_of(by_n.get(cur, {})):
            stack.append((nxt, path + [nxt]))
    return None


def unblock(root: Path, track: str, n: int) -> tuple[bool, str]:
    """The condition came true. Also what `start` does, so picking one up is enough."""
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if not t.get("blocked"):
        return False, say("not_aside", n=n)
    was = t["blocked"]
    _update(root, track, n, blocked="")
    return True, say("unblocked", n=n, was=was)


def _get(root: Path, track: str, n: int) -> tuple[dict | None, str]:
    """One row, WITH its body — the only reader that needs one, and the only one that pays.

    The ledger keeps front matter and a `brief` flag, because a listing says "has a brief"
    and never prints one. Whoever asks for a specific row is asking to read it, so this is
    the one place a body is fetched, and it is one file.
    """
    items = {t["n"]: t for t in _all(root, track)}
    if n not in items:
        return None, say("no_such", n=n, track=track)
    got = items[n]
    if "body" not in got:
        got = dict(got, body=_read_todo(got["path"])["body"])
    return got, ""


def _same_title(a: str, b: str) -> bool:
    """Two titles name one to-do when they differ only in case, punctuation or spacing."""
    return re.sub(r"[^a-z0-9]+", " ", a.lower()).strip() == re.sub(r"[^a-z0-9]+", " ", b.lower()).strip()


def _cites_hint(root: Path, track: str, n: int, meta: dict) -> str:
    """Three open to-dos citing one doc, none in a plan, read like a plan kept in a doc."""
    doc = str(meta.get("doc") or "").split(".")[0]
    if not doc:
        return ""
    import plans
    member = plans.membership(root, track)
    others = [t["n"] for t in open_items(root, track)
              if t["n"] != n and str(t.get("doc") or "").split(".")[0] == doc and t["n"] not in member]
    return say("cites_plan_hint", others=", ".join(map(str, others)), doc=doc) if len(others) >= 2 else ""


#: a to-do or a plan named in running text — "to-do 12", "todo 12", "plan 4"
_MENTION = re.compile(r"(?i)\b(to-?do|plan)\s*#?\s*(\d{1,5})\b")


def mentions_hint(root: Path, track: str, n: int, body: str, t: dict | None = None) -> str:
    """A NUDGE, NEVER A GATE. A brief that says "after the migration lands" or names another
    row is stating a dependency in prose, and prose is not something `ready` can read — the
    row is offered anyway and the constraint is discovered by a reader, or not at all. So
    when a brief names a to-do or a plan and the row records no dependency, the write says
    so and names the command. It does not refuse, and it does not repeat once one is
    recorded: the agent is told once, at the moment it wrote the thing.
    """
    t = t if t is not None else (_get(root, track, n)[0] or {})
    if (t.get("after") or "").strip():
        return ""
    seen, args = [], []
    for kind, num in _MENTION.findall(body or ""):
        num = int(num)
        plan = kind.lower() == "plan"
        if not plan and num == n:
            continue
        ref = say("after_plan", p=num) if plan else f"to-do {num}"
        if ref in seen:
            continue
        seen.append(ref)
        args.append(f"plan {num}" if plan else str(num))
    if not seen:
        return ""
    return say("mentions", refs=seen, them="it" if len(seen) == 1 else "them", n=n, args=" ".join(args))


def add(root: Path, track: str, title: str, body: str, at: str, where: dict | None = None) -> tuple[bool, str]:
    """Write one. Refuses an empty title and a duplicate open one."""
    title = " ".join((title or "").split())
    if not title:
        return False, say("add_empty")
    for t in open_items(root, track):
        if _same_title(t["title"], title):
            return False, say("duplicate", n=t["n"])
    items = _all(root, track)
    n = _next_n(root, track, items)
    path = folder(root, track) / f"{n:03d}-{_slug(title)}.md"
    meta = {"title": title, "track": track, "at": at, **{k: str(v) for k, v in (where or {}).items()}}
    _write(path, meta, body)
    return True, say("added", n=n, track=track, title=title, path=path.relative_to(root.parent)) + _cites_hint(root, track, n, meta)


def retitle(root: Path, track: str, n: int, title: str) -> tuple[bool, str]:
    title = " ".join((title or "").split())
    if not title:
        return False, say("add_empty")
    # the same rule as adding: two open rows with one title make `work end "<title>" --todo` ambiguous
    for other in open_items(root, track):
        if other["n"] != n and _same_title(other["title"], title):
            return False, say("duplicate", n=other["n"])
    t, err = _update(root, track, n, title=title)
    return (True, say("retitled", n=n, title=title)) if t else (False, err)


def _update(root: Path, track: str, n: int, **fields) -> tuple[dict | None, str]:
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    meta = {k: t.get(k, "") for k in FIELDS}
    meta.update({k: v for k, v in fields.items()})
    _write(t["path"], meta, t["body"])
    if fields.get("done"):
        import plans
        plans.announce(root, track, str(fields["done"]))
    return {**t, **meta}, ""


_HEADING = re.compile(r"^##\s+(.+?)\s*$")


def _sections(body: str) -> list[tuple[str, str]]:
    """[(title, text)], in the order they appear in the body.

    A SECTION IS AN ATX `## <name>` HEADING plus everything up to the next one or the
    end of the file — level 2, deliberately, so it never collides with a `# <title>` a
    hand-written brief might already carry. The stretch before the first heading (most
    briefs, today) is title "". `text` includes its own heading line for a named
    section, so `"\\n".join(text for _, text in sections)` reproduces the body exactly —
    that is what `replace_section` relies on to touch only the one section it names.
    """
    lines = (body or "").split("\n")
    out: list[tuple[str, str]] = []
    title = ""
    buf: list[str] = []
    for line in lines:
        m = _HEADING.match(line)
        if m:
            out.append((title, "\n".join(buf)))
            title, buf = m.group(1).strip(), [line]
        else:
            buf.append(line)
    out.append((title, "\n".join(buf)))
    return out


def _snapshot(t: dict) -> Path:
    """Copy the whole file, unchanged, to struck/ before it is rewritten.

    A to-do has no per-part files to move individually the way a doc's part does, so the
    whole file is the snapshot. NOTHING IS EVER DELETED holds here too: the file named
    here is the pre-edit brief, in full, reachable after the edit that replaced it.
    """
    struck_dir = t["path"].parent / STRUCK
    struck_dir.mkdir(exist_ok=True)
    # MICROSECONDS, NOT SECONDS: two edits inside one automated run (a test, a script)
    # land inside the same second often enough that a coarser stamp would make the
    # second snapshot silently overwrite the first — the exact silent loss this whole
    # mechanism exists to prevent.
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%f")
    dst = struck_dir / f"{t['path'].stem}-{stamp}.md"
    dst.write_text(t["path"].read_text())
    return dst


def amend(root: Path, track: str, n: int, title: str, addition: str) -> tuple[bool, str]:
    """Append a NEW `## <title>` section to a brief. Mirrors `docs.part`.

    Refuses a title that already names a section — journal todos replace updates one of
    those — and refuses an empty addition, the same discipline `journal todos add`
    already applies to an empty title: a write that reports success and lands wrong is
    the one failure this project exists to prevent.
    """
    title = " ".join((title or "").split())
    if not title:
        return False, say("amend_title")
    addition = (addition or "").rstrip("\n")
    if not addition.strip():
        return False, say("amend_body")
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if any(existing.lower() == title.lower() for existing, _ in _sections(t["body"]) if existing):
        return False, say("amend_exists", n=n, title=title)
    _snapshot(t)
    sep = "\n\n" if t["body"].strip() else ""
    new_body = t["body"].rstrip("\n") + sep + f"## {title}\n{addition}\n"
    _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_body)
    return True, say("amended", n=n, title=title, struck=STRUCK)


def replace_section(root: Path, track: str, n: int, title: str, new_text: str) -> tuple[bool, str]:
    """Replace ONE named section, byte-for-byte elsewhere; without a title, the whole
    body. Mirrors `docs.replace`. A title that names no section refuses and lists what
    the brief does have, rather than guessing or silently appending.
    """
    new_text = (new_text or "").rstrip("\n")
    if not new_text.strip():
        return False, say("replace_body")
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    title = " ".join((title or "").split())
    sections = _sections(t["body"])
    if not title:
        _snapshot(t)
        _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_text + "\n")
        return True, say("replaced_whole", n=n, struck=STRUCK)
    named = [s for s in sections if s[0]]
    match = next((s for s in named if s[0].lower() == title.lower()), None)
    if match is None:
        have = ", ".join(say("section_quoted", title=s[0]) for s in named) or say("no_sections")
        return False, say("no_section", n=n, title=title, have=have)
    _snapshot(t)
    rebuilt = [f"## {title}\n{new_text}" if existing.lower() == title.lower() else text
               for existing, text in sections]
    new_body = "\n".join(rebuilt)
    if not new_body.endswith("\n"):
        new_body += "\n"
    _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_body)
    return True, say("replaced", n=n, title=title, struck=STRUCK)


def start(root: Path, track: str, n: int, at: str, strict: bool = False,
          agent: str = "") -> tuple[dict | None, str]:
    """Pick a to-do up. An AGENT picking one up also claims it, through `assign`.

    PICKING IT UP IS CLAIMING IT, and the absence of that cost a dogfood run its report: a
    subagent ran `todos start 1`, worked the row, and was then refused by `report` with
    "held by `nobody`" — because `started` and `assigned` were two facts and only a
    dispatcher set the second. Nothing in the flow told it to assign itself, so the hold
    that `ready` checks was never taken and the row stayed offerable to anyone the whole
    time it was being worked.

    THE CLAIM GOES THROUGH `assign` RATHER THAN BESIDE IT. One funnel holds a row, so the
    refusal an agent gets for a row another live agent holds is the same sentence whichever
    door it came in by, and the lapse-on-heartbeat rule has one implementation.
    """
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    if t.get("done"):
        return None, say("already_done", n=n, how=close_note(t) or say("no_reason"))
    if strict and t.get("asks") and not t.get("answer"):
        # A DELEGATED ACTOR CANNOT REACH THE USER: what waits on them is not startable for
        # it. A session may start it — the user answered in the conversation.
        nxt = next((x for x in ready(root, track) if x["n"] != n), None)
        return None, say("start_waits", n=n, asks=t["asks"],
                         next=say("start_next", n=nxt["n"], title=nxt["title"]) if nxt else say("start_nothing"))
    if agent:
        ok, why = assign(root, track, n, agent)
        if not ok:
            return None, why
    # PICKING IT UP ENDS THE BLOCK. A to-do set aside on a condition is being started, so
    # the condition is over by the only judgement that can decide it. The question and its
    # answer stay, as history.
    return _update(root, track, n, started=at, blocked="")


def done(root: Path, track: str, n: int, how: str, at: str) -> tuple[bool, str]:
    how = " ".join((how or "").split())
    if not how:
        return False, say("done_empty")
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, say("already_done", n=n, how=close_note(t))
    _update(root, track, n, done=at, how=how)
    return True, say("done", n=n, title=t["title"], how=how)


def move(root: Path, track: str, n: int, dst: str, at: str) -> tuple[bool, str]:
    """Move a to-do to another environment, brief and all.

    THE FILE MOVES AND THE NUMBER CHANGES, because a to-do's number is its filename and the
    numbering is per environment. What it was is kept in `moved_from`, so a to-do named by
    an old message can still be found. Nothing is left behind: unlike a pin, a to-do is not
    re-asserted into anybody's context, so a tombstone would only be a second entry to read.
    """
    dst = state.slug(dst)
    if not dst:
        return False, say("move_where")
    if dst == state.slug(track):
        return False, say("move_same", n=n, env=dst)
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    there = _all(root, dst)
    # THE DESTINATION'S NEXT NUMBER, archived rows counted: `len + 1` gave a moved to-do the
    # number of a row archived there, and a reference to that number then meant two rows.
    to = _next_n(root, dst, there)
    meta = {k: t.get(k, "") for k in FIELDS}
    meta["track"] = dst
    meta["moved_from"] = f"{track}/{n}"
    path = folder(root, dst) / f"{to:03d}-{_slug(t['title'])}.md"
    _write(path, meta, t["body"])
    t["path"].unlink()
    return True, say("moved", n=n, track=track, to=to, env=dst, title=t["title"], path=path.relative_to(root.parent))


def reopen(root: Path, track: str, n: int, why: str, at: str) -> tuple[bool, str]:
    """Undo a close, on the record.

    THE PRICE OF CLOSING A TO-DO AUTOMATICALLY. `done` is a field with no verb that cleared
    it, so a wrong number — a typo in a commit trailer, a close that fired on the wrong
    environment — could only be undone by hand-editing the markdown. Nothing that closes
    without a human in the loop should be that expensive to reverse. The reason is required
    and the old close is kept beside it, so a reopen is auditable rather than silent.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, say("reopen_why")
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if not t.get("done"):
        return False, say("reopen_open", n=n)
    was = close_note(t) or say("no_reason")
    _update(root, track, n, done="", how="", struck="", reopened=f"{at} · {why} (was closed: {was})")
    return True, say("reopened", n=n, title=t["title"], why=why, was=was)


#: WHERE A PRUNED FILE GOES BY DEFAULT — never `STRUCK`, which already means something
#: else here (a pre-edit SNAPSHOT of a brief that is about to be overwritten, kept
#: beside the row it belongs to; see `_snapshot`). A pruned to-do is the whole ROW
#: leaving the counted list, so it gets its own folder rather than crowding a name that
#: already has a job.
ARCHIVE = "archived"


ARCHIVE_DAYS = "todos_archive_days"
DEFAULT_ARCHIVE_DAYS = 7
LAST_N = "todos_last_n"
#: the highest number given out on an environment, kept in its own to-do folder
LAST_FILE = ".last_number"


def _next_n(root: Path, track: str, items: list[dict]) -> int:
    """One past the highest number ever given here, so an archived or deleted to-do's number is never reused."""
    import os
    highest = items[-1]["n"] if items else 0
    try:
        with os.scandir(folder(root, track) / ARCHIVE) as it:
            for e in it:
                m = re.match(r"(\d+)-", e.name)
                if m:
                    highest = max(highest, int(m.group(1)))
    except OSError:
        pass
    # IN THE ENVIRONMENT'S OWN FOLDER, NOT THE RECORD. Kept in record.json, every `todos add` wrote the
    # project-wide record, and a subagent lent one environment touched a file every session shares.
    # A number kept there by an older version is still read, never written.
    got = state.get(root, LAST_N, {})
    kept = int(got.get(track) or 0) if isinstance(got, dict) else 0
    counter = folder(root, track) / LAST_FILE
    try:
        kept = max(kept, int(counter.read_text().strip() or 0))
    except (OSError, ValueError):
        pass
    n = max(highest, kept) + 1
    try:
        counter.parent.mkdir(parents=True, exist_ok=True)
        counter.write_text(f"{n}\n")
    except OSError:
        pass
    return n


def archive_days(root: Path, track: str) -> int:
    """How many days a done to-do stays listed on this environment; 0 means until archived by hand."""
    got = state.get(root, ARCHIVE_DAYS, {})
    value = got.get(track) if isinstance(got, dict) else None
    return DEFAULT_ARCHIVE_DAYS if value is None else int(value)


def set_archive_days(root: Path, track: str, days: int) -> tuple[bool, str]:
    if days is None or int(days) < 0:
        return False, say("keep_usage")
    with state.locked(root):
        got = state.get(root, ARCHIVE_DAYS, {})
        got = got if isinstance(got, dict) else {}
        got[track] = int(days)
        state.put(root, ARCHIVE_DAYS, got)
    return True, say("kept", env=track, days=int(days)) if int(days) else say("kept_always", env=track)


def auto_archive(root: Path, track: str, at: str) -> int:
    """Move the done to-dos older than this environment's archive days into archived/; how many moved."""
    days = archive_days(root, track)
    if not days:
        return 0
    cutoff, _ = _prune_cutoff(f"{days}d", at)
    old = [t for t in _all(root, track) if t.get("done") and t["done"] < cutoff]
    if old:
        prune(root, track, f"{days}d", at)
    return len(old)


def _prune_cutoff(word: str, now: str) -> tuple[str | None, str]:
    """(the ISO cutoff, "") from a duration ("30d", "2h", "6w") or a date/timestamp
    typed as-is — or (None, the refusal). Nothing here guesses a default age: pruning
    clears rows off the list for good, and a silent number would be the one time this
    package's "ask, don't assume" habit matters most.
    """
    import re as _re
    from datetime import datetime, timedelta, timezone
    word = (word or "").strip()
    if not word:
        return None, say("prune_empty")
    m = _re.fullmatch(r"(\d+)([hdw])", word.lower())
    if m:
        n, unit = int(m.group(1)), m.group(2)
        hours = {"h": 1, "d": 24, "w": 24 * 7}[unit]
        try:
            when = datetime.now(timezone.utc) - timedelta(hours=n * hours)
        except OverflowError:
            return None, say("prune_large", word=word)
        return when.isoformat(timespec="seconds"), ""
    try:
        when = datetime.fromisoformat(word.replace("Z", "+00:00"))
    except ValueError:
        return None, say("prune_bad", word=repr(word))
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return when.isoformat(timespec="seconds"), ""


def prune(root: Path, track: str, word: str, at: str, force: bool = False) -> tuple[bool, str]:
    """Clear DONE to-dos older than `word` off the list — archived under `archived/`
    by default, actually removed with `force`. An OPEN to-do is never touched, whatever
    its age; "done" already covers a dropped one too, since `strike`/`drop` close a
    to-do through the same `done` field a normal finish does.

    ARCHIVED, NOT STRUCK — a moved file is invisible to `_all` for free: it scans the
    folder itself, not subfolders (see `_stamped`), so nothing here has to teach the
    read path a new exclusion. `force` is the one real deletion this package does
    anywhere; everywhere else "gone" means "hidden, on purpose, and still on disk."
    """
    cutoff, err = _prune_cutoff(word, at)
    if cutoff is None:
        return False, err
    items = _all(root, track)
    candidates = [t for t in items if t.get("done") and t["done"] < cutoff]
    if not candidates:
        return True, say("prune_nothing", date=cutoff[:10])
    d = folder(root, track)
    if force:
        for t in candidates:
            t["path"].unlink(missing_ok=True)
        said = say("pruned_deleted", n=len(candidates))
    else:
        arc = d / ARCHIVE
        arc.mkdir(exist_ok=True)
        for t in candidates:
            t["path"].rename(arc / t["path"].name)
        said = say("pruned_archived", n=len(candidates), archive=ARCHIVE)
    _LISTED.pop(str(d), None)
    more = len(candidates) - 12 if len(candidates) > 12 else None
    return True, say("pruned", said=said, date=cutoff[:10], nums=[t["n"] for t in candidates[:12]], more=more)


def titled(root: Path, track: str, title: str) -> dict | None:
    """The started to-do whose title is these words, if there is one. Reads, decides nothing.

    THE MATCH AND THE CLOSE ARE TWO QUESTIONS, and for a long time one function answered
    both. Ending work said whether a row existed AND marked it done in the same breath, so
    the only way to learn a row was about to close was to close it.
    """
    want = " ".join(title.split()).lower()
    return next((t for t in open_items(root, track)
                 if t["title"].lower() == want and t.get("started")), None)


#: the note `work end --todo` writes; read after "Closed:" in the viewer and "done 3h ago:" in the CLI
WORK_CLOSED = "its work ended"
#: notes written before, shown with today's wording
OLD_CLOSE_NOTES = {"closed with the work that finished it": WORK_CLOSED}


def close_note(t: dict) -> str:
    how = t.get("how") or ""
    return OLD_CLOSE_NOTES.get(how, how)


def close_titled(root: Path, track: str, title: str, at: str,
                 agent: str = "") -> tuple[str, str]:
    """Close the to-do whose title these words are. ASKED FOR, never automatic.

    IT USED TO FIRE ON EVERY `work end` AND IT WAS WRONG 36 TIMES. In one real project 710
    of 1,810 closed rows — 39% — were closed by this and not by anyone deciding they were
    done; the 36 are only the ones an agent later noticed and reopened, in words that say
    exactly what happened: "parked on a Kit gap, not done — the work-end closed it", "closed
    by a work-end of the same name while I was filing, not by any implementation", "five of
    seven sites remain; the work end matched its title and closed it". One row had it happen
    twice.

    THE CAUSE WAS ONE MISSING DISTINCTION. `work end` meant both "this is finished" and "I
    am putting this down", because there was no verb for the second. An agent interrupted
    mid-row does the tidy thing — closes its declaration before switching — and the record
    heard "done". The user's ruling: closing a to-do is always explicit. `journal todos done
    <n>`, a `Journal: todos done <n>` commit trailer, or `work end "<subject>" --todo`, which
    is the one-command form and still says so out loud.

    A SUBAGENT CLOSES NOTHING, AND THIS IS THE DOOR IT WENT THROUGH. `report` refuses to
    close and says the parent does it; then `work end`, on the subject `todos start` itself
    opened, closed the row here — unconditionally, with no idea who was calling. Two agents
    in one dogfood run found it: one guessed the hint did not apply to it and worked around
    it, the other followed the documented order exactly — report, then `work end` — and
    marked its own homework. The guarantee held everywhere it was written down and nowhere
    it was wired.

    SO THE CHECK GOES WHERE THE WRITE IS. It was in `report` alone, which is the door that
    announces the rule; the row is `assigned` either way, and that field is what says a
    close is not this caller's to make. The work still ends — that is the agent's own
    ledger and nobody else's — and the row stays standing for whoever dispatched it.
    """
    t = titled(root, track, title)
    if not t:
        return "", ""
    held = t.get("assigned") or ""
    if held and state.slug(agent) == held:
        return "", say("stays_open", n=t["n"], held=held)
    _update(root, track, t["n"], done=at, how=WORK_CLOSED)
    return str(t["n"]), ""


# ─────────────────────────────── closing from a commit message ────────────────────────────
#: THE PROTOCOL. A commit that finishes a to-do says so in a trailer, in the CLI's own
#: spelling, on its own line in the message:
#:
#:      Journal: todos done 990
#:      Journal: todos done cli-streamline/4 the cap landed with the page
#:
#: A TRAILER, NEVER PROSE. Commit messages here argue, at length, about to-dos — "this
#: closes the placement question" is a sentence, not an instruction, and a matcher loose
#: enough to read it is loose enough to close the wrong thing. The line must start with the
#: trailer and spell the command. `#990` is not used: it belongs to the forge.
#:
#: AT COLUMN 0, AND FOR ONE REASON: a message that DOCUMENTS this protocol shows an example,
#: and an example is indented. Leading whitespace was allowed at first and the commit that
#: added the feature came within one line of closing a to-do numbered in its own changelog.
#: Anywhere in the message is fine — the footer, beside the other trailers, is where it is
#: read — but a line with a space in front of it is a quotation, not an instruction.
#:
#: THE NUMBER IS PER ENVIRONMENT, so `990` alone is ambiguous across a project with several.
#: It resolves against the session's environment first, then against the only environment that
#: has that number — and REFUSES when more than one does, because a close nobody can see is
#: worse than a close that did not happen. `<environment>/<n>` says it outright.
def now() -> str:
    """One timestamp shape, for the callers that write a to-do without going through the CLI."""
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


TRAILER = "Journal:"
#: COLUMN ZERO, AND THAT IS DELIBERATE — do not "fix" it. Allowing leading whitespace was
#: tried, on the theory that an indented second trailer explained a report of only the first
#: one closing; test_commit holds the opposite and is right: commit messages here discuss
#: to-dos at length, and an INDENTED line is how this project quotes one. A quotation that
#: closes a to-do is worse than a trailer that has to be unindented.
#:
#: A RUN OF BARE NUMBERS AFTER THE FIRST IS MORE REFS, NOT THE START OF `how`. One
#: commit, `Journal: todos done 2263 2264`, closed 2263 and read "2264" as free text —
#: silently, with nothing in the reply saying a second number had been swallowed. The
#: number closes; only the FIRST ref may carry an `<environment>/`, because a bulk close
#: on one line means "these, in the environment I already named or the one this session
#: is on" — repeating the environment per number buys nothing a second trailer line
#: didn't already offer. The tradeoff this accepts: a `how` that happens to start with a
#: bare number ("4 files touched") now reads as a second ref too. That ref then fails or
#: closes something unintended — visibly, in the reply `close_from_commit` returns for
#: every ref — which is still better than the silent swallow this replaces.
_TRAILER = re.compile(r"^Journal:[ \t]*todos?[ \t]+done[ \t]+"
                      r"(?:(?P<env>[A-Za-z0-9][A-Za-z0-9 _.-]*?)/)?(?P<n>\d+)"
                      r"(?P<more>(?:[ \t]+\d+)*)[ \t]*(?P<how>.*)$",
                      re.IGNORECASE | re.MULTILINE)


def commit_at(project: Path, ref: str = "HEAD") -> tuple[str, str, str] | None:
    """A commit as (sha, subject, whole message), or None where there is no such commit.

    READ THE COMMIT, NOT THE COMMAND that made it. The command is what was asked for; the
    commit is what happened — so a commit a gate rejected closes nothing, and `-m`, `-F -`
    and an editor session all parse the same, because none of them are parsed at all.
    """
    import subprocess
    try:
        p = subprocess.run(["git", "log", "-1", "--format=%H%n%s%n%B", ref], cwd=str(project),
                           capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    if p.returncode != 0 or not p.stdout.strip():
        return None
    sha, _, rest = p.stdout.partition("\n")
    subject, _, body = rest.partition("\n")
    return sha.strip(), subject.strip(), body


def refs_in(message: str) -> list[tuple[str | None, int, str]]:
    """Every close the message asks for: (environment or None, number, the how it gave).

    A line naming several numbers yields several refs, all with the same `how` and the
    same environment (or none) — see the comment on `_TRAILER`.
    """
    out = []
    for m in _TRAILER.finditer(message or ""):
        env = " ".join(m.group("env").split()) if m.group("env") else None
        how = " ".join(m.group("how").split())
        out.append((env, int(m.group("n")), how))
        for extra in m.group("more").split():
            out.append((env, int(extra), how))
    return out


def environments_with_todos(root: Path) -> list[str]:
    """The environment names that own at least one to-do, read off the to-dos themselves."""
    d = root / DIR
    names = []
    for sub in sorted(d.iterdir()) if d.is_dir() else []:
        if not sub.is_dir():
            continue
        first = next((_parse(f) for f in sorted(sub.glob("*.md"))), None)
        names.append((first or {}).get("track") or sub.name)
    return names


def close_from_commit(root: Path, message: str, how_default: str, at: str,
                      here: str | None = None) -> list[tuple[bool, str]]:
    """Act on every trailer in a commit message.

    Back comes one (did it close, what to say) per ref — the caller writes the headline,
    because "the trailer closed what it named" is a lie when the number was wrong, and a
    hook that overstates what it did is one an agent learns to skim.
    """
    said: list[tuple[bool, str]] = []
    for env, n, how in refs_in(message):
        if env is None:
            seen: set[str] = set()
            owners = []
            for e in ([here] if here else []) + environments_with_todos(root):
                if e not in seen and _get(root, e, n)[0] is not None:
                    seen.add(e)
                    owners.append(e)
            if not owners:
                said.append((False, say("commit_none", n=n)))
                continue
            if len(owners) > 1 and (here not in owners):
                said.append((False, say("commit_ambiguous", n=n, owners=owners, trailer=TRAILER)))
                continue
            env = here if here in owners else owners[0]
        t, err = _get(root, env, n)
        if t is None:
            said.append((False, err))
            continue
        if t.get("done"):
            # AN AMEND OR A REBASE RUNS THE HOOK AGAIN over the same message. That is a
            # no-op with a note, not a failure: nothing about the record is wrong.
            said.append((False, say("commit_closed_already", n=n, env=env, how=close_note(t))))
            continue
        ok, msg = done(root, env, n, how or how_default, at)
        said.append((ok, (say("commit_closed", line=msg.splitlines()[0], env=env) + _end_its_work(root, t["title"], at))
                     if ok else msg))
    return said


def _end_its_work(root: Path, title: str, at: str) -> str:
    """End the open work named after a to-do that just closed: a closed row leaves no work standing.

    ONLY `ask` AND `block` DID THIS. `todos done`, a drop and a commit trailer closed the row and left
    its work open for good, holding every stop after it.
    """
    import work
    if not any(w["subject"] == title for w in work.open_work(root)):
        return ""
    closed, _ = work.end(root, title, at)
    return say("closed_its_work", title=title) if closed else ""


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


# ─────────────────────────── the to-do's meta: a state, not a chain ────────────────────────
#: A TO-DO IS IN EXACTLY ONE OF THESE, and `_state` is the one place that decides which. It
#: used to be an if/elif ladder inline in `render`, nine branches deep, checked in this same
#: order — and the order is not free: `asks` is set by `ask` and NOTHING EVER CLEARS IT, so
#: a to-do that was once asked a question and has since been started, assigned, reported,
#: blocked or given an `after` carries `asks` right along. Checked this early, it shadows
#: every one of those: `started`, `assigned`, `reported`, `blocked` and `after` are each
#: UNREACHABLE for the rest of that to-do's life, and it reads "waits on the user" forever
#: even mid-work. That is a real bug, reported rather than fixed here — fixing it changes
#: what a live to-do prints, and this pass promised the rendered text would not move.
_STATES = ("done", "answered", "asks", "reported", "assigned", "blocked", "after", "started",
          "waiting")


#: WHAT A TO-DO IS, AND THE TEST THAT SAYS SO. Each row is a state and the predicate that
#: puts a to-do in it; the first match wins, and every predicate is written so that at most
#: one CAN match. That second half is the whole point — a ladder whose rungs overlap makes
#: its own ORDER load-bearing, and then the order is a decision nobody wrote down and
#: everybody has to preserve.
#:
#: `asks` WAS HISTORY BEING READ AS STATE. `ask()` records the question and `answer()`
#: records the reply, and neither is ever cleared — correctly: the exchange is the record of
#: why this row is what it is. But the ladder tested `t["asks"]` third, so any to-do that had
#: EVER been asked a question shadowed every state below it: started, assigned, reported,
#: blocked, after. A row could be picked up, worked, and reported finished while still
#: printing "waits on the user", for the rest of the project. Found by a dogfood agent that
#: was folding this listing into the shared one and refused to fix it silently.
#:
#: SO THE PREDICATE IS PRECISE INSTEAD OF THE ORDER BEING CLEVER. Waiting on the user means
#: a question with no answer AND nobody has picked it up. Starting a row is an agent saying
#: it will proceed without the answer, which is a legitimate thing to do and used to be
#: invisible.
_STATES = (
    ("done",     lambda t: bool(t.get("done"))),
    ("answered", lambda t: answered_one(t)),
    ("asks",     lambda t: bool(t.get("asks")) and not t.get("answer") and not t.get("started")),
    ("reported", lambda t: bool(t.get("reported"))),
    ("assigned", lambda t: bool(t.get("assigned"))),
    ("blocked",  lambda t: bool(t.get("blocked"))),
    ("after",    lambda t: bool(t.get("after"))),
    ("started",  lambda t: bool(t.get("started"))),
    ("waiting",  lambda t: True),
)


def _state(t: dict) -> str:
    """Which state this to-do is in. One name, from one table — see `_STATES`."""
    return next(name for name, is_it in _STATES if is_it(t))


def states_of(t: dict) -> list[str]:
    """EVERY state whose predicate matches, most significant first.

    A LADDER CANNOT BE CHECKED FROM THE OUTSIDE. It always returns exactly one answer, so a
    rung in the wrong place shows up only as a wrong answer in a case nobody thought of —
    which is precisely how `asks` shadowed five states for as long as it did. This exposes
    what else was true, so a test can assert the PRECEDENCE itself rather than assert its
    way through a handful of hand-picked rows.
    """
    return [name for name, is_it in _STATES[:-1] if is_it(t)]


def question_counts(root: Path, track: str) -> dict[int, tuple[int, int]]:
    """to-do number -> (open, answered) questions linked to it, read in one pass."""
    import questions
    out: dict[int, list[int]] = {}
    for q in questions._all(root, track):
        if q.get("withdrawn") or q.get("removed"):
            continue
        for ref in q.get("links") or []:
            kind, _, num = str(ref).partition(":")
            if kind == "todo" and num.isdigit():
                pair = out.setdefault(int(num), [0, 0])
                pair[0 if questions.is_open(q) else 1] += 1
    return {n: (a, b) for n, (a, b) in out.items()}


def _plan_of(root: Path, track: str, n: int) -> dict | None:
    import plans
    got = plans.membership(root, track).get(n)
    return {"n": got[0], "phase": got[1]} if got else None


def row_response(root: Path, track: str, t: dict, short_refs: bool = False,
                 counts: dict[int, tuple[int, int]] | None = None, by_n: dict | None = None) -> dict:
    """One to-do as a plain, JSON-safe dict — the shape the web viewer serves, built
    from the SAME predicates (`states_of`, `after_of`, `waiting_on`) the terminal
    renderer's own `facts()` reads to build its one-line sentence per row. Neither
    re-derives what counts as blocked, after or waiting on the user; only how that
    is finally SAID differs — a joined sentence for a terminal, separate fields for
    a page that renders its own badges and links from them.
    """
    asked = (question_counts(root, track) if counts is None else counts).get(t["n"], (0, 0))
    return {
        "questions_open": asked[0],
        "questions_answered": asked[1],
        "n": t["n"],
        "title": t.get("title", ""),
        "states": states_of(t),
        "at": t.get("at", ""),
        "age": _age(t.get("at", "")),
        "blocked": t.get("blocked") or "",
        "after": after_of(t),
        "after_plan": after_plan(t),
        "waiting_on": waiting_on(root, track, t, by_n=by_n),
        "waiting_on_plan": waiting_on_plan(root, track, t),
        "asks": t.get("asks") or "",
        "answer": t.get("answer") or "",
        "doc": str(t["doc"]) if t.get("doc") else "",
        "transcript": str(t["transcript"]) if t.get("transcript") else "",
        "priority": priority_of(t),
        "meta": facts_text(root, track, t, short_refs, by_n=by_n),
        "started": t.get("started") or "",
        "done": t.get("done") or "",
        "plan": _plan_of(root, track, t["n"]),
        "closed_at": t.get("done") or "",
        "done_age": _age(t.get("done") or ""),
        "how": close_note(t),
    }


def rows_response(root: Path, track: str) -> list[dict]:
    """Every to-do on this environment, as plain dicts, newest first — what
    the to-dos controller serves; its `show` starts from `row_response` for one."""
    items = _all(root, track)
    by_n = {x["n"]: x for x in items}
    rows = [row_response(root, track, t, by_n=by_n) for t in items]
    return sorted(rows, key=lambda r: r["n"], reverse=True)


def _held(root: Path, track: str, t: dict) -> str:
    import agents as ag
    return say("held", agent=t["assigned"], age=ag.age(root, track, t["assigned"]))


def work_log(root: Path, track: str, t: dict) -> list[dict]:
    """What was done on a to-do: each piece of work started from it, its updates, waits and end."""
    import work
    title = " ".join(t["title"].split()).lower()
    out = []
    # each entry carries its work item's number, so the viewer can open that work
    for wn, w in enumerate(work._all(root, track), 1):
        if w.get("removed") or (w.get("todo") != t["n"] and w["subject"].lower() != title):
            continue
        out.append({"at": w.get("at", ""), "kind": "started", "text": w["subject"], "work": wn})
        out.extend({"at": x.get("at", ""), "kind": "update", "text": x.get("text", ""), "work": wn} for x in w.get("notes") or [])
        if w.get(work.AWAIT):
            out.append({"at": w[work.AWAIT].get("at", ""), "kind": "waiting", "text": w[work.AWAIT].get("what", ""), "work": wn})
        out.extend({"at": c.get("at", ""), "kind": "commit", "text": c.get("subject", ""), "sha": c.get("sha", ""), "work": wn}
                   for c in w.get("commits") or [])
        if w.get("ended"):
            out.append({"at": w["ended"], "kind": "ended", "text": w.get("ended_note") or "", "work": wn})
    out.sort(key=lambda e: e["at"])
    return [{**e, "age": _age(e["at"])} for e in out]


def _started(root: Path, track: str, t: dict) -> str:
    """`started` is never cleared by a plain `work end` — only `--todo`/`done` clears the
    row — so a row that was started and then ended without closing it still says
    `started`, and claiming "work is open" for it unconditionally was a lie the moment
    that happened. Say so only when `work.open_work` actually has a matching subject.
    """
    import work
    live = any(w["subject"].lower() == t["title"].lower() for w in work.open_work(root))
    return say("started_live" if live else "started_ended", age=_age(t["started"]))


def _after_text(t: dict, left: list[int]) -> str:
    return say("state_after", after=t["after"], tail=say("state_after_open", n=len(left)) if left else say("state_after_done"))


#: THE TABLE FROM STATE TO SENTENCE. One entry per name `_state` can return, and every name
#: it can return has one: adding a state means adding a row here, not another `elif`.
_STATE_TEXT = {
    "done": lambda root, track, t: say("state_done", age=_age(t["done"]), how=close_note(t) or say("no_reason")),
    "answered": lambda root, track, t: say("state_answered"),
    "asks": lambda root, track, t: say("state_asks"),
    "reported": lambda root, track, t: say("state_reported", by=t.get("by") or "?", how=t["reported"]),
    "assigned": _held,
    "blocked": lambda root, track, t: say("state_blocked", why=t["blocked"]),
    "after": lambda root, track, t: _after_text(t, waiting_on(root, track, t)),
    "started": _started,
    "waiting": lambda root, track, t: say("state_waiting", age=_age(t.get("at", ""))),
}


def render(root: Path, track: str, *, all_of_them: bool = False, width: int | None = None, short_refs: bool = False,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC, order_by_id: bool = False) -> str:
    """The list as a person reads it: the title, where it stands, and any question below.

    CAPPED LIKE `carry` (below), for the same reason: a bare `journal todo` is asked for
    fresh each time rather than handed automatically, so it pages past the cap instead
    of just saying how many more there are. `cap` is None by default — the environment
    pickup page (`tracks.page`) calls this uncapped on purpose: a runner has to see the
    WHOLE ordered list, not the first page of it.

    THE LOOP IS `entries.listing`, shared with `docs.catalogue` and `tools.catalogue` —
    only `facts` below is this noun's own, exactly the strategy `pins._store` already
    supplies for a pin, a rule and a reminder.

    ORDERED BY PRIORITY UNLESS `order_by_id` SAYS OTHERWISE. `entries.listing`/
    `fmt.paged` order and page whatever list they are handed; the only change here is
    WHICH list that is — pre-sorted by priority (ascending, ties keeping their number
    order) so the existing `order=asc|desc` reversal still means what it already means:
    DESC (the default) reads highest-first, exactly as it read newest-first before.

    THE QUESTION AND ITS ANSWER ARE NOT A FACT, and stay out of `facts`: a fact is a short
    fragment joined into one line with " · ", and a wrapped line breaks wherever it must —
    measured, folding a long answer in with the rest put the wrap point inside the arrow
    itself, on this exact to-do, and the test that reads "→ " off the front of it failed.
    They get their own wrapped block beneath, exactly as they always did.
    """
    width = fmt.room(width)
    import entries
    everything = _all(root, track)
    by_n = {x["n"]: x for x in everything}
    items = everything if all_of_them else [t for t in everything if not t.get("done")]
    if not items:
        return say("empty_all" if all_of_them else "empty_open")
    if not order_by_id:
        items = sorted(items, key=priority_of)

    rows, left = entries.listing(items, lambda t: row_response(root, track, t, short_refs, by_n=by_n), cap=cap, page=page,
                                 order=order)
    return render_rows(rows, width) + fmt.more("todos", left, page, order)


def facts_text(root: Path, track: str, t: dict, short_refs: bool = False, by_n: dict | None = None) -> str:
    """The line beneath a to-do's title: where it stands, its priority, its brief, its doc."""
    state = _state(t)
    out = [_after_text(t, waiting_on(root, track, t, by_n=by_n)) if state == "after" else _STATE_TEXT[state](root, track, t)]
    if priority_of(t) != DEFAULT_PRIORITY:
        out.append(say("fact_priority", label=priority_label(priority_of(t))))
    out.append(say("fact_brief") if t.get("brief") or t.get("body") else say("fact_title_only"))
    if t.get("doc"):
        import docs as docs_mod
        out.append(say("fact_doc", label=docs_mod.ref_label(root, str(t["doc"]), short=short_refs)))
    if where := _plan_of(root, track, t["n"]):
        out.append(say("fact_plan", n=where["n"], p=where["phase"]))
    return " · ".join(out)


def render_rows(rows: list[dict], width: int | None = None) -> str:
    """To-do rows (`row_response`) as the terminal list: title, facts, and a waiting question beneath."""
    width = fmt.room(width)
    blocks = []
    for r in rows:
        entry = fmt.render(fmt.Out(items=(fmt.Item(n=r["n"], text=r["title"], meta=r["meta"], struck=bool(r["done"])),)))
        # only while it still waits: not started, not done
        if r["asks"] and not r["done"] and not r["started"]:
            entry += "\n" + fmt.wrap(say("question", asks=r["asks"]), indent=5, width=width)
            if r["answer"]:
                entry += "\n" + fmt.wrap(say("answer", answer=r["answer"]), indent=5, width=width)
        blocks.append(entry)
    return "\n\n".join(blocks)


def show(root: Path, track: str, n: int, width: int | None = None) -> tuple[bool, str]:
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    return True, show_text(detail(root, track, t), width)


def detail(root: Path, track: str, t: dict) -> dict:
    """One to-do in full, as data: its row, its brief, and what the terminal page says of it."""
    meta = [say("meta_env", env=track)]
    if t.get("at"):
        meta.append(say("meta_written", age=_age(t["at"]), date=t["at"][:10]))
    if t.get("line"):
        meta.append(say("meta_line", line=t["line"]))
    if t.get("started"):
        meta.append(say("meta_started", age=_age(t["started"])))
    if t.get("done"):
        meta.append(say("meta_done", age=_age(t["done"]), how=close_note(t)))
    doc_files, doc_n = [], ""
    if t.get("doc"):
        import docs as docs_mod
        meta.append(say("fact_doc", label=docs_mod.ref_label(root, str(t["doc"]))))
        doc, _, _ = docs_mod.get(root, str(t["doc"]).split(".")[0])
        if doc is not None:
            doc_n = doc["n"]
            doc_files = [str(p.relative_to(root.parent.resolve())) if root.parent.resolve() in p.parents else str(p)
                         for p in docs_mod.file_paths(doc)]
    return {**row_response(root, track, t), "body": t.get("body", ""), "how": close_note(t),
            "doc_n": doc_n, "doc_files": doc_files, "log": work_log(root, track, t),
            "facts": " · ".join(meta), "file": str(t["path"].relative_to(root.parent)) if t.get("path") else ""}


def show_text(t: dict, width: int | None = None) -> str:
    """A to-do's `detail` as the terminal page."""
    width = fmt.room(width)
    n = t["n"]
    out = [fmt.title(say("show_title", n=n), sub=" ".join(t["title"].split())), "  " + fmt.dim(t["facts"])]
    if t.get("from_messages"):
        out.append("  " + fmt.dim(say("from_messages", ns=[m["n"] for m in t["from_messages"]])))
    if t["asks"]:
        out.append(fmt.section(say("section_answered" if t["answer"] else "section_waiting")))
        out.append(fmt.wrap(t["asks"], width=width))
        if t["answer"]:
            out.append("")
            out.append(fmt.wrap(say("answer", answer=t["answer"]), width=width))
    out.append(fmt.section(say("section_brief")))
    # fmt.PROSE, NOT fmt.wrap AND NOT fmt.block. `wrap` joins every line of the brief into
    # one, which swallows an indented list and a `## ` heading alike into run-on prose.
    # `block` was the other extreme: it kept every stored line exactly as written, so a
    # paragraph hard-wrapped by its author at whatever width their editor had wrapped a
    # SECOND time in a narrower terminal and left a stub under each line. `prose` is the
    # distinction — a paragraph flows, a list and a code block and a table do not.
    out.append(fmt.prose(t["body"], width=width) if t["body"] else say("title_only"))
    if t.get("log"):
        out.append(fmt.section(say("section_log")))
        for e in t["log"]:
            # a kind with no word of its own reads as the kind itself: a new log kind must never take the command down
            kind = MESSAGES.get(f"log_{e['kind']}", e["kind"])
            out.append(fmt.gist(say("log_row", age=e["age"], kind=kind, text=e["text"]), width))
    if t.get("doc_files"):
        out.append(fmt.section(say("section_doc_files", n=t["doc_n"])))
        out.extend("  " + f for f in t["doc_files"][:20])
        if len(t["doc_files"]) > 20:
            out.append("  " + fmt.dim(f"… journal docs paths {t['doc_n']}"))
    out.append("")
    rows = []
    if not t["done"]:
        rows.append((say("cmd_start", n=n), say("cmd_start_what")))
        rows.append((say("cmd_done", n=n), say("cmd_done_what")))
        if t["asks"] and not t["answer"]:
            rows.append((say("cmd_answer", n=n), say("cmd_answer_what")))
        elif not t["asks"]:
            rows.append((say("cmd_ask", n=n), say("cmd_ask_what")))
            rows.append((say("cmd_block", n=n), say("cmd_block_what")))
            rows.append((say("cmd_after", n=n), say("cmd_after_what")))
    if rows:
        out.append(fmt.commands(rows))
    if t["file"]:
        out.append("  " + fmt.dim(t["file"]))
    return "\n".join(out)


AUTO = "auto"


def auto(root: Path, track: str | None = None) -> bool:
    """May the agent work through the list without asking? ONE SWITCH FOR THE WHOLE JOURNAL.

    OFF BY DEFAULT, AND THE DEFAULT IS THE POINT. A to-do is work the user put off, and
    whether it gets picked up is their call — unless they have said that the agent should
    work through the list on its own.

    IT WAS A MAP KEYED BY ENVIRONMENT, and the user ended that for a reason they watched
    happen: an agent that switches environments came to a halt the moment it moved to one
    where the flag was off. `track` is still accepted, and ignored, while the callers are
    moved. A journal that still holds the old map reads as ON if any environment had it on,
    until the migration rewrites it.
    """
    got = state.get(root, AUTO, False)
    if isinstance(got, dict):
        return any(bool(v) for v in got.values())
    return bool(got)


def set_auto(root: Path, on: bool) -> str:
    """Turn it on or off for the whole journal."""
    with state.locked(root):
        state.put(root, AUTO, bool(on))
    return say("auto_on" if on else "auto_off")


def _loop_line(root: Path) -> str:
    from settings import load
    m = load(root)[0].get("auto_loop_minutes", 0)
    if not m:
        return ""
    return say("loop_line", m=m)


def carry(root: Path, track: str, cap: int = 0) -> str:
    """The block a session start hands over. Titles only; what it asks depends on auto.

    CAPPED AFTER THE SORT, NEVER BEFORE. The answered ones come first because they are the
    user's word to proceed, and the ones waiting on the user carry their question — so
    those are exactly the entries a trim must never take. Sorting first and cutting the
    tail means what is dropped is the ordinary end of the list, and `fmt.cut` says how many
    and which command reads them.
    """
    import plans
    plan = plans.carry_line(root, track)
    waiting = open_items(root, track)
    if not waiting:
        return plan
    def line(t):
        s = say("carry_line", n=str(t["n"]).rjust(3), title=t["title"])
        if answered_one(t):
            s += say("carry_answered", answer=t["answer"], asks=t["asks"])
        elif t.get("asks") and not t.get("started"):
            s += say("carry_asks", asks=t["asks"])
        return s
    ordered = sorted(waiting, key=lambda t: 0 if answered_one(t) else 1)
    shown = ordered[:cap] if cap else ordered
    titles = "\n".join(line(t) for t in shown) + fmt.cut(len(shown), len(ordered), "journal todos")
    blocked = asking(root, track)
    unstuck = answered(root, track)
    lead = say("carry_lead", n=len(unstuck)) if unstuck else ""
    if auto(root, track):
        block = say("carry_auto", n=len(waiting), loop=_loop_line(root), lead=lead, titles=titles,
                    asking=say("carry_asking", n=len(blocked)) if blocked else "")
    else:
        block = say("carry_manual", n=len(waiting), lead=lead, titles=titles)
    return f"{plan}\n\n{block}" if plan else block
