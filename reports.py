from __future__ import annotations

import re
from pathlib import Path

import fmt
import state
from pins import age
from templates import render

KEY = "reports"

KINDS = {"todo": "to-do", "question": "question"}

_REF = re.compile(r"^\s*(to-?dos?|questions?)\s*[:#\s]\s*(\d+)\s*$", re.I)

MESSAGES = {
    "needs_title": 'a report needs a title: journal reports add "<title>" --brief',
    "needs_body": "a report needs its text — pass it on stdin with --brief",
    "not_a_ref": "{text} is not something a report answers; write `todo 22` or `question 4`",
    "no_todo": "there is no to-do {n} on this environment",
    "no_question": "there is no question {n} on this environment",
    "added": "report {n}: {title}[ — for {about}]\n  the user reads it in the viewer; it is not a doc and is never handed to a session",
    "no_report": "there is no report {n}. `journal reports` numbers them.",
    "archive_why": 'say why: journal reports archive {n} "<why>"',
    "already_archived": "report {n} is already archived",
    "archived": "report {n} is archived: {why}",
    "label": "{kind} {n}",
    "fact_for": "for {about}",
    "fact_archived": "archived: {why}",
    "expired": "older than {days} day(s)",
    "keep_usage": "journal reports keep <days>: how many days a report stays listed on this environment; 0 keeps them",
    "kept": "reports on `{env}` stay listed for {days} day(s), then are archived",
    "kept_always": "reports on `{env}` stay listed until archived by hand",
    "show": "REPORT {n}  {title}\n  {meta}\n\n{body}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def parse_ref(text: str) -> tuple[str | None, str]:
    m = _REF.match(text or "")
    if not m:
        return None, say("not_a_ref", text=repr(text))
    kind = "todo" if m.group(1).lower().startswith("to") else "question"
    return f"{kind}:{m.group(2)}", ""


def label(ref: str) -> str:
    kind, _, n = ref.partition(":")
    return say("label", kind=KINDS.get(kind, kind), n=n) if ref else ""


def _check(root: Path, ref: str, track: str | None) -> str | None:
    kind, _, num = ref.partition(":")
    n = int(num)
    if kind == "todo":
        import todo
        t, _ = todo.item(root, track or state.current_track(root), n)
        return None if t else say("no_todo", n=n)
    import questions
    return None if 1 <= n <= len(questions._all(root, track)) else say("no_question", n=n)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def add(root: Path, title: str, body: str, at: str, about: str = "", source: str = "cli",
        track: str | None = None) -> tuple[bool, str]:
    title = " ".join((title or "").split())
    if not title:
        return False, say("needs_title")
    if not (body or "").strip():
        return False, say("needs_body")
    ref = ""
    if about:
        ref, why = parse_ref(about)
        if ref is None:
            return False, why
        why = _check(root, ref, track)
        if why:
            return False, why
    with state.locked(root):
        items = _all(root, track)
        items.append({"title": title, "body": body.strip(), "at": at, "source": source, "about": ref,
                      "archived": None, "archived_at": None})
        _put(root, items, track)
        n = len(items)
    return True, say("added", n=n, title=title, about=label(ref) or None)


def archive(root: Path, n: int, why: str, at: str, track: str | None = None) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, say("archive_why", n=n)
    with state.locked(root):
        items = _all(root, track)
        if not 1 <= n <= len(items):
            return False, say("no_report", n=n)
        r = items[n - 1]
        if r.get("archived"):
            return False, say("already_archived", n=n)
        r["archived"], r["archived_at"] = why, at
        _put(root, items, track)
    return True, say("archived", n=n, why=why)


ARCHIVE_DAYS = "reports_archive_days"
DEFAULT_ARCHIVE_DAYS = 30


def archive_days(root: Path, track: str) -> int:
    """How many days a report stays listed on this environment; 0 means until archived by hand."""
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


def expired(r: dict, days: int) -> bool:
    """Older than the environment's setting, and not archived by hand: treated as archived, nothing is written."""
    if not days or r.get("archived") or not r.get("at"):
        return False
    from datetime import datetime, timezone
    try:
        when = datetime.fromisoformat(r["at"].replace("Z", "+00:00"))
    except ValueError:
        return False
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return (datetime.now(timezone.utc) - when).total_seconds() > days * 86400


def archived_why(r: dict, days: int) -> str:
    return r.get("archived") or (say("expired", days=days) if expired(r, days) else "")


def facts(r: dict, days: int = 0) -> str:
    out = [age(r.get("at", ""))] if age(r.get("at", "")) else []
    if r.get("about"):
        out.append(say("fact_for", about=label(r["about"])))
    if archived_why(r, days):
        out.append(say("fact_archived", why=archived_why(r, days)))
    return " · ".join(out)


def row_response(n: int, r: dict, body: bool = False, days: int = 0) -> dict:
    row = {"n": n, "title": r.get("title", ""), "gist": fmt.gist(" ".join((r.get("body") or "").split())),
           "at": r.get("at", ""), "age": age(r.get("at", "")) if r.get("at") else "", "about": r.get("about") or "",
           "about_label": label(r.get("about") or ""), "archived": archived_why(r, days), "meta": facts(r, days)}
    if body:
        row["body"] = r.get("body", "")
    return row
