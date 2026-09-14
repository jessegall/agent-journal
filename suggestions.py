from __future__ import annotations

import re
from pathlib import Path

import fmt
import state
from pins import age
from templates import render

KEY = "suggestions"
MAX_OPEN = 5

MESSAGES = {
    "needs_title": 'a suggestion needs the change, in one line: journal suggest "<the change>" --brief',
    "needs_body": "a suggestion needs its reasoning — what you saw, what it costs now and later — on stdin with --brief",
    "too_many": "the user already has {n} suggestions to decide on this environment ({open:, }); withdraw one, or wait for a decision",
    "declined_before": "suggestion {n} was declined: {title}[ — {why}]. If something has changed, say what: "
                       'journal suggest "<the change>" --brief --despite={n} --because="<what changed>"',
    "despite_because": "--despite needs --because: say what changed since suggestion {n} was declined",
    "added": "suggestion {n}: {title}[ (about {links:, })]\n  it waits for the user's decision; keep doing the work as asked",
    "no_suggestion": "there is no suggestion {n}. `journal suggestions` numbers them.",
    "decided": "suggestion {n} is already {status}",
    "accepted": "suggestion {n} is accepted: to-do {todo} is filed from it",
    "adjusted": "suggestion {n} is accepted with your change: to-do {todo} is filed from it",
    "needs_change": 'say what to change: journal suggestions adjust {n} "<your change>"',
    "declined": "suggestion {n} is declined[: {why}]",
    "needs_why": 'say why: journal suggestions withdraw {n} "<why>"',
    "withdrawn": "suggestion {n} is withdrawn: {why}",
    "edited": "suggestion {n} is updated",
    "todo_body": "From suggestion {n}, which the user {how}.\n\n{body}[\n\n## The user's change\n\n{change}][\n\n## The user's note\n\n{note}]",
    "how_accepted": "accepted",
    "how_adjusted": "accepted with a change",
    "fact_open": "waiting on the user",
    "fact_accepted": "accepted → {todo}",
    "fact_adjusted": "adjusted → {todo}",
    "fact_declined": "declined[: {why}]",
    "fact_withdrawn": "withdrawn: {why}",
    "fact_about": "about {links:, }",
    "show": "SUGGESTION {n}  {title}\n  {meta}\n\n{body}",
    "show_change": "\n\n  THE USER'S CHANGE\n{change}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def status(s: dict) -> str:
    if s.get("withdrawn"):
        return "withdrawn"
    if s.get("declined") is not None and s.get("declined_at"):
        return "declined"
    if s.get("became"):
        return "adjusted" if s.get("change") else "accepted"
    return "open"


def open_items(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    return [(n, s) for n, s in enumerate(_all(root, track), 1) if status(s) == "open"]


def _words(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-z0-9]+", (text or "").lower()) if len(w) > 2}


def _close(a: dict, title: str, links: list[str]) -> bool:
    mine, theirs = _words(title), _words(a.get("title", ""))
    shared = mine & theirs
    near = bool(mine and theirs) and len(shared) / min(len(mine), len(theirs)) >= 0.5
    return near or bool(set(links) & set(a.get("links") or []))


def add(root: Path, title: str, body: str, at: str, about: list[str] | None = None, source: str = "cli",
        track: str | None = None, despite: int | None = None, because: str = "", cap: int = MAX_OPEN) -> tuple[bool, str]:
    import questions
    title = " ".join((title or "").split())
    if not title:
        return False, say("needs_title")
    if not (body or "").strip():
        return False, say("needs_body")
    links, why = questions._refs(root, about or [], track)
    if why:
        return False, why
    items = _all(root, track)
    standing = [(n, s) for n, s in enumerate(items, 1) if status(s) == "open"]
    if cap and len(standing) >= cap:
        return False, say("too_many", n=len(standing), open=[f"{n} {fmt.gist(s['title'], 40)}" for n, s in standing])
    because = " ".join((because or "").split())
    if despite and not because:
        return False, say("despite_because", n=despite)
    for n, s in enumerate(items, 1):
        if status(s) == "declined" and _close(s, title, links) and not (despite == n and because):
            return False, say("declined_before", n=n, title=s["title"], why=s.get("declined") or None)
    with state.locked(root):
        items = _all(root, track)
        items.append({"title": title, "body": body.strip(), "at": at, "source": source, "links": links,
                      "became": "", "change": "", "note": "", "decided_at": None, "declined": None, "declined_at": None,
                      "withdrawn": None, "withdrawn_at": None, "told_at": None,
                      **({"despite": despite, "because": because} if despite else {})})
        _put(root, items, track)
        n = len(items)
    return True, say("added", n=n, title=title, links=[questions.label(r) for r in links] or None)


def _open(items: list[dict], n: int) -> tuple[dict | None, str]:
    if not 1 <= n <= len(items):
        return None, say("no_suggestion", n=n)
    s = items[n - 1]
    if status(s) != "open":
        return None, say("decided", n=n, status=status(s))
    return s, ""


def _decide(root: Path, n: int, at: str, track: str | None, change: str = "", note: str = "") -> tuple[bool, str]:
    import todo
    here = track or state.current_track(root)
    s, why = _open(_all(root, here), n)
    if s is None:
        return False, why
    body = say("todo_body", n=n, how=say("how_adjusted" if change else "how_accepted"), body=s["body"],
               change=change or None, note=note or None)
    ok, message = todo.add(root, here, s["title"], body, at, where={"suggestion": n})
    if not ok:
        return False, message
    filed = int(re.search(r"to-do (\d+)", message).group(1))
    with state.locked(root):
        items = _all(root, here)
        s = items[n - 1]
        s["became"], s["change"], s["note"], s["decided_at"], s["told_at"] = f"todo:{filed}", change, note, at, None
        _put(root, items, here)
    return True, say("adjusted" if change else "accepted", n=n, todo=filed)


def accept(root: Path, n: int, at: str, note: str = "", track: str | None = None) -> tuple[bool, str]:
    return _decide(root, n, at, track, note=" ".join((note or "").split()))


def adjust(root: Path, n: int, change: str, at: str, track: str | None = None) -> tuple[bool, str]:
    change = (change or "").strip()
    if not change:
        return False, say("needs_change", n=n)
    return _decide(root, n, at, track, change=change)


def decline(root: Path, n: int, why: str, at: str, track: str | None = None) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    with state.locked(root):
        items = _all(root, track)
        s, err = _open(items, n)
        if s is None:
            return False, err
        s["declined"], s["declined_at"], s["decided_at"], s["told_at"] = why, at, at, None
        _put(root, items, track)
    return True, say("declined", n=n, why=why or None)


def withdraw(root: Path, n: int, why: str, at: str, track: str | None = None) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, say("needs_why", n=n)
    with state.locked(root):
        items = _all(root, track)
        s, err = _open(items, n)
        if s is None:
            return False, err
        s["withdrawn"], s["withdrawn_at"] = why, at
        _put(root, items, track)
    return True, say("withdrawn", n=n, why=why)


def edit(root: Path, n: int, title: str | None, body: str | None, track: str | None = None) -> tuple[bool, str]:
    with state.locked(root):
        items = _all(root, track)
        s, err = _open(items, n)
        if s is None:
            return False, err
        if title is not None and " ".join(title.split()):
            s["title"] = " ".join(title.split())
        if body is not None and body.strip():
            s["body"] = body.strip()
        _put(root, items, track)
    return True, say("edited", n=n)


def untold(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    return [(n, s) for n, s in enumerate(_all(root, track), 1)
            if status(s) in ("accepted", "adjusted", "declined") and not s.get("told_at")]


def mark_told(root: Path, track: str | None, ns: list[int], at: str) -> None:
    with state.locked(root):
        items = _all(root, track)
        for n in ns:
            if 1 <= n <= len(items):
                items[n - 1]["told_at"] = at
        _put(root, items, track)


def facts(s: dict) -> str:
    import questions
    st = status(s)
    todo_label = questions.label(s.get("became") or "") if s.get("became") else ""
    out = [{"open": lambda: say("fact_open"), "accepted": lambda: say("fact_accepted", todo=todo_label),
            "adjusted": lambda: say("fact_adjusted", todo=todo_label),
            "declined": lambda: say("fact_declined", why=s.get("declined") or None),
            "withdrawn": lambda: say("fact_withdrawn", why=s.get("withdrawn"))}[st]()]
    if age(s.get("at", "")):
        out.append(age(s["at"]))
    if s.get("links"):
        out.append(say("fact_about", links=[questions.label(r) for r in s["links"]]))
    return " · ".join(out)


def row_response(n: int, s: dict) -> dict:
    import questions
    return {"n": n, "title": s.get("title", ""), "body": s.get("body", ""), "gist": fmt.gist(" ".join(s.get("body", "").split())),
            "status": status(s), "at": s.get("at", ""), "age": age(s.get("at", "")) if s.get("at") else "",
            "links": [{"ref": r, "label": questions.label(r)} for r in s.get("links") or []],
            "became": s.get("became") or "", "change": s.get("change") or "", "note": s.get("note") or "",
            "declined": s.get("declined") or "", "withdrawn": s.get("withdrawn") or "", "meta": facts(s),
            "closed_at": (s.get("withdrawn_at") or s.get("declined_at") or s.get("decided_at") or "") if status(s) != "open" else ""}


def show_text(d: dict) -> str:
    out = say("show", n=d["n"], title=d["title"], meta=d["meta"], body=fmt.prose(d["body"]))
    if d.get("change"):
        out += say("show_change", change=fmt.prose(d["change"]))
    return out
