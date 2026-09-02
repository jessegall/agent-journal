"""Delayed work — what the agent should remember TO DO. Not a rule, not a pin, not in flight.

A pin is a claim, a rule binds, open work is in flight. None of them holds "do this later",
and a piece of work that is only remembered in a summary is a piece of work that is
forgotten at the next compaction. So a to-do is written down, and it is written as a FILE:
a to-do is a brief, not a claim, and when it is picked up in a week the reader needs what,
why and where to start, which is longer than one line. A file can be edited by hand and
read in a diff.

SCOPED TO THE TRACK. A to-do belongs to the line of work that deferred it, and one track's
debts do not bleed into another's: `todo/<track>/NNN-<slug>.md`. The number is the file's,
stable for the life of the to-do, so "to-do 3" means the same thing after 2 is done.

SAID, NEVER HELD, AND NOT AT EVERY STOP. An idle agent told "three to-dos are waiting"
will start one; whether it should is the user's call. The line says so, and it is said once
per transcript and again only when the list has changed — a reminder at every idle stop is
wallpaper within the hour.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import fmt
import state

DIR = "todo"
FIELDS = ("title", "track", "at", "session", "line", "started", "done", "how", "asks", "answer", "doc")


def _slug(text: str, limit: int = 40) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return (s[:limit].rstrip("-") or "untitled")


def folder(root: Path, track: str) -> Path:
    return root / DIR / _slug(track, 60)


def _parse(path: Path) -> dict:
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
    lines = ["---"] + [f"{k}: {meta.get(k, '') or ''}" for k in FIELDS] + ["---", ""]
    if body.strip():
        lines += [body.strip(), ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))


def _all(root: Path, track: str) -> list[dict]:
    d = folder(root, track)
    if not d.is_dir():
        return []
    return sorted((_parse(f) for f in d.glob("*.md")), key=lambda m: m["n"])


def open_items(root: Path, track: str) -> list[dict]:
    return [t for t in _all(root, track) if not t.get("done")]


def ready(root: Path, track: str) -> list[dict]:
    """Open to-dos that are NOT waiting on the user: what auto may pick up. Answered first."""
    items = [t for t in open_items(root, track) if not t.get("asks") or t.get("answer")]
    return sorted(items, key=lambda t: 0 if answered_one(t) else 1)


def asking(root: Path, track: str) -> list[dict]:
    """Open to-dos waiting on the user, each with its question, not yet answered."""
    return [t for t in open_items(root, track) if t.get("asks") and not t.get("answer")]


def answered_one(t: dict) -> bool:
    return bool(t.get("asks") and t.get("answer") and not t.get("started") and not t.get("done"))


def answered(root: Path, track: str) -> list[dict]:
    """To-dos the user has answered and nobody has picked up yet: the agent is unstuck."""
    return [t for t in open_items(root, track) if answered_one(t)]


def answer(root: Path, track: str, n: int, text: str) -> tuple[bool, str]:
    """The user's answer to a to-do's question, from the terminal, on the record.

    THE OTHER HALF OF `ask`. The agent parked a question; the user reads it in `journal
    todo` and answers here without opening a session. The to-do is ready again and goes
    first: the next stop tells the agent which question was answered and what the answer
    was, and hands it that to-do before any other.
    """
    text = " ".join((text or "").split())
    if not text:
        return False, 'say the answer: journal todo answer <n> "<the answer>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    if not t.get("asks"):
        return False, f"to-do {n} is not waiting on a question; `journal todo start {n}` picks it up"
    _update(root, track, n, answer=text)
    return True, f"answered to-do {n}: {t['title']}\n  the agent is told at its next stop and picks it up first"


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
        return False, 'say what the user must decide: journal todo ask <n> "<the question>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    _update(root, track, n, asks=question, started="")
    return True, f"to-do {n} waits on the user: {question}"


def _get(root: Path, track: str, n: int) -> tuple[dict | None, str]:
    items = {t["n"]: t for t in _all(root, track)}
    if n not in items:
        return None, f"there is no to-do {n} on track `{track}`. `journal todo` numbers them."
    return items[n], ""


def add(root: Path, track: str, title: str, body: str, at: str, where: dict | None = None) -> tuple[bool, str]:
    """Write one. Refuses an empty title and a duplicate open one."""
    title = " ".join((title or "").split())
    if not title:
        return False, 'a to-do needs a title: journal todo "<what, in a few words>"'
    for t in open_items(root, track):
        if t["title"].lower() == title.lower():
            return False, f"already waiting as to-do {t['n']} — nothing to add"
    items = _all(root, track)
    n = (items[-1]["n"] if items else 0) + 1
    path = folder(root, track) / f"{n:03d}-{_slug(title)}.md"
    meta = {"title": title, "track": track, "at": at, **{k: str(v) for k, v in (where or {}).items()}}
    _write(path, meta, body)
    return True, f"to-do {n} on `{track}`: {title}\n  {path.relative_to(root.parent)}"


def _update(root: Path, track: str, n: int, **fields) -> tuple[dict | None, str]:
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    meta = {k: t.get(k, "") for k in FIELDS}
    meta.update({k: v for k, v in fields.items()})
    _write(t["path"], meta, t["body"])
    return {**t, **meta}, ""


def start(root: Path, track: str, n: int, at: str) -> tuple[dict | None, str]:
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    if t.get("done"):
        return None, f"to-do {n} is already done ({t.get('how') or 'no reason recorded'})"
    return _update(root, track, n, started=at)  # the question and its answer stay, as history


def done(root: Path, track: str, n: int, how: str, at: str) -> tuple[bool, str]:
    how = " ".join((how or "").split())
    if not how:
        return False, 'say how it was resolved: journal todo done <n> "<how>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    _update(root, track, n, done=at, how=how)
    return True, f"done {n}: {t['title']}\n  {how}"


def close_titled(root: Path, track: str, title: str, at: str) -> str | None:
    """When work with a to-do's title ends, the to-do is done too. The number, if so."""
    want = " ".join(title.split()).lower()
    for t in open_items(root, track):
        if t["title"].lower() == want and t.get("started"):
            _update(root, track, t["n"], done=at, how="closed with the work of the same name")
            return str(t["n"])
    return None


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


def render(root: Path, track: str, *, all_of_them: bool = False, width: int = 88) -> str:
    """The list as a person reads it: the title, where it stands, and any question below."""
    items = _all(root, track) if all_of_them else open_items(root, track)
    if not items:
        return "  Nothing is waiting." if not all_of_them else "  No to-dos on this track."
    out = []
    for t in items:
        if t.get("done"):
            meta = f"done {_age(t['done'])}: {t.get('how') or 'no reason recorded'}"
        elif answered_one(t):
            meta = "answered by the user, not yet picked up"
        elif t.get("asks"):
            meta = "waits on the user"
        elif t.get("started"):
            meta = f"started {_age(t['started'])}, work is open"
        else:
            meta = f"waiting {_age(t.get('at', ''))}" if _age(t.get("at", "")) else "waiting"
        meta += " · has a brief" if t["body"] else " · title only"
        if t.get("doc"):
            import docs as docs_mod
            meta += " · → " + docs_mod.ref_label(root, str(t["doc"]))
        entry = fmt.numbered(t["n"], t["title"], meta, struck=bool(t.get("done")), width=width)
        if t.get("asks") and not t.get("done") and not t.get("started"):
            entry += "\n" + fmt.wrap("? " + t["asks"], indent=5, width=width)
            if t.get("answer"):
                entry += "\n" + fmt.wrap("→ " + t["answer"], indent=5, width=width)
        out.append(entry)
    return "\n\n".join(out)


def show(root: Path, track: str, n: int, width: int = 88) -> tuple[bool, str]:
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    meta = [f"track {track}"]
    if t.get("at"):
        meta.append(f"written {_age(t['at'])} ({t['at'][:10]})")
    if t.get("line"):
        meta.append(f"line {t['line']}")
    if t.get("started"):
        meta.append(f"started {_age(t['started'])}")
    if t.get("done"):
        meta.append(f"done {_age(t['done'])}: {t.get('how')}")
    if t.get("doc"):
        import docs as docs_mod
        meta.append("→ " + docs_mod.ref_label(root, str(t["doc"])))
    out = [fmt.title(f"TO-DO {n}", sub=" ".join(t["title"].split())), "  " + fmt.dim(" · ".join(meta))]
    if t.get("asks"):
        out.append(fmt.section("the user answered" if t.get("answer") else "waiting on the user"))
        out.append(fmt.wrap(t["asks"], width=width))
        if t.get("answer"):
            out.append("")
            out.append(fmt.wrap("→ " + t["answer"], width=width))
    out.append(fmt.section("brief"))
    out.append(fmt.wrap(t["body"], width=width) if t["body"] else "  (title only; no brief was written)")
    out.append("")
    rows = []
    if not t.get("done"):
        rows.append((f"journal todo start {n}", "pick it up"))
        rows.append((f'journal todo done {n} "<how>"', "close it without starting"))
        if t.get("asks") and not t.get("answer"):
            rows.append((f'journal todo answer {n} "<answer>"', "answer it (the user)"))
        elif not t.get("asks"):
            rows.append((f'journal todo ask {n} "<question>"', "it waits on the user"))
    if rows:
        out.append(fmt.commands(rows))
    out.append("  " + fmt.dim(str(t["path"].relative_to(root.parent))))
    return True, "\n".join(out)


AUTO = "auto"


def auto(root: Path, track: str) -> bool:
    """May the agent work through this track's list without asking?

    OFF BY DEFAULT, AND THE DEFAULT IS THE POINT. A to-do is work the user put off, and
    whether it gets picked up is their call — unless they have said, for this track, that
    the agent should work through the list on its own. The flag is that saying, on the
    record, per track: a track of chores can drain while a track of design questions waits.
    """
    got = state.get(root, AUTO, {})
    return bool(isinstance(got, dict) and got.get(track))


def set_auto(root: Path, track: str, on: bool) -> str:
    with state.locked(root):
        got = state.get(root, AUTO, {})
        got = got if isinstance(got, dict) else {}
        got[track] = bool(on)
        state.put(root, AUTO, got)
    return (f"auto ON for `{track}`: whenever no work is open, the agent picks up the next "
            "to-do on its own and keeps going until the list is empty."
            if on else
            f"auto OFF for `{track}`: to-dos are listed and never started without the user's word.")


def _loop_line(root: Path) -> str:
    from settings import load
    m = load(root)[0].get("auto_loop_minutes", 0)
    if not m:
        return ""
    return (f"Keep a loop running while auto is on, if none is: the `loop` skill with "
            f"`{m}m journal next`, so an idle session comes back every {m} minutes and carries "
            "on until nothing is left it can do.")


def carry(root: Path, track: str) -> str:
    """The block a session start hands over. Titles only; what it asks depends on auto."""
    waiting = open_items(root, track)
    if not waiting:
        return ""
    def line(t):
        s = f"  {t['n']:>3}  {t['title']}"
        if answered_one(t):
            s += f"\n       ANSWERED by the user: {t['answer']}\n       (the question was: {t['asks']})"
        elif t.get("asks") and not t.get("started"):
            s += f"\n       waiting on the user: {t['asks']}"
        return s
    titles = "\n".join(line(t) for t in sorted(waiting, key=lambda t: 0 if answered_one(t) else 1))
    blocked = asking(root, track)
    unstuck = answered(root, track)
    lead = (f"{len(unstuck)} of these the user has ANSWERED since they were parked — pick those up "
            "first.\n" if unstuck else "")
    if auto(root, track):
        return (
            f"TO DO on this track, {len(waiting)} waiting — AUTO MODE IS ON: this list is worked "
            "through without asking. Whenever nothing is open, pick up the next one with "
            "`journal todo start <n>`, solve it yourself, `journal work end` it, and keep going "
            "until the list is empty. Every choice a brief leaves open is yours: make it, write it "
            "in `journal work update`, carry on. Ask the user only when you cannot proceed without "
            "something only they can supply, or the hook says you are stalled — then `journal todo "
            'ask <n> "<what is stuck>"` and move to the next. ' + _loop_line(root)
            + "\n" + lead + titles
            + (f"\n{len(blocked)} of these wait on the user; the questions are above. When the "
               "user answers, `journal todo start <n>`." if blocked else "")
            + "\n`journal todo <n>` reads the brief; `journal todo auto off` turns this off."
        )
    return (
        f"TO DO on this track, {len(waiting)} waiting — delayed work, not an instruction to "
        "start any of it. Start one only when the user says so, or asks you to work through "
        "them (then offer `journal todo auto on`). A to-do the user has ANSWERED is theirs "
        "saying to do it: start it.\n" + lead + titles
        + "\n`journal todo <n>` reads the brief; `journal todo start <n>` picks one up."
    )
