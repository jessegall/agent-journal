from __future__ import annotations

import re
from pathlib import Path

import state
from pins import age
from templates import render

KEY = "notifications"

KINDS = {"inbox": "message", "todo": "to-do", "question": "question", "report": "report", "doc": "doc", "plan": "plan"}

_REF = re.compile(r"^\s*(to-?dos?|questions?|reports?|docs?|plans?|messages?|inbox)\s*[:#\s]\s*(\d+)\s*$", re.I)

MESSAGES = {
    "needs_text": 'a notification needs its text: journal notify "<what finished>"',
    "no_row": "there is no {kind} {n} for this to point at",
    "not_a_ref": "{text} is not something a notification can point at; write `todo 22`, `question 4`, `report 1`, `doc 3` or `plan 2`",
    "sent": "notification {n} is on the user's Home[, pointing at {about}] — keep these for what the user wants to hear about",
    "no_notification": "there is no notification {n}. `journal notifications` numbers them.",
    "read": "notification {n} is read",
    "already_read": "notification {n} was already read",
    "all_read": "{n} notification(s) marked read",
    "label": "{kind} {n}",
    "fact_unread": "unread",
    "fact_read": "read[ {age}]",
    "fact_about": "about {about}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def parse_ref(text: str) -> tuple[str | None, str]:
    m = _REF.match(text or "")
    if not m:
        return None, say("not_a_ref", text=repr(text))
    word = m.group(1).lower()
    kind = "todo" if word.startswith("to") else "inbox" if word in ("message", "messages", "inbox") else word.rstrip("s")
    return f"{kind}:{m.group(2)}", ""


def label(ref: str) -> str:
    kind, _, n = (ref or "").partition(":")
    return say("label", kind=KINDS.get(kind, kind), n=n) if ref else ""


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def unread(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    return [(n, x) for n, x in enumerate(_all(root, track), 1) if not x.get("read_at")]


def _exists(root: Path, ref: str, track: str | None) -> str | None:
    """The row this points at, or why it is not there. One funnel: questions.check_ref knows them all."""
    kind, _, num = ref.partition(":")
    if kind == "report":
        return None if 1 <= int(num) <= len(_reports(root, track)) else say("no_row", kind=KINDS[kind], n=num)
    if kind == "plan":
        import plans
        return None if 1 <= int(num) <= len(plans._all(root, track)) else say("no_row", kind=KINDS[kind], n=num)
    import questions
    return questions.check_ref(root, ref, track)


def _reports(root: Path, track: str | None):
    import reports
    return reports._all(root, track)


def add(root: Path, text: str, at: str, about: str = "", source: str = "cli",
        track: str | None = None) -> tuple[bool, str]:
    text = " ".join((text or "").split())
    if not text:
        return False, say("needs_text")
    ref = ""
    if about:
        ref, why = parse_ref(about)
        if ref is None:
            return False, why
        # AND IT HAS TO BE THERE. `parse_ref` only checks the SHAPE, so `--about="todo 999"` put a dead
        # link on the user's Home — the most visible place the journal has. Reports and comments both
        # check the row exists before writing; this is the same check, in the same order.
        missing = _exists(root, ref, track)
        if missing:
            return False, missing
    with state.locked(root):
        items = _all(root, track)
        items.append({"text": text, "at": at, "source": source, "about": ref, "read_at": None})
        _put(root, items, track)
        n = len(items)
    return True, say("sent", n=n, about=label(ref) or None)


def read(root: Path, n: int, at: str, track: str | None = None) -> tuple[bool, str]:
    with state.locked(root):
        items = _all(root, track)
        if not 1 <= n <= len(items):
            return False, say("no_notification", n=n)
        if items[n - 1].get("read_at"):
            return False, say("already_read", n=n)
        items[n - 1]["read_at"] = at
        _put(root, items, track)
    return True, say("read", n=n)


def read_all(root: Path, at: str, track: str | None = None) -> tuple[bool, str]:
    with state.locked(root):
        items = _all(root, track)
        fresh = [x for x in items if not x.get("read_at")]
        for x in fresh:
            x["read_at"] = at
        if fresh:
            _put(root, items, track)
    return True, say("all_read", n=len(fresh))


def facts(x: dict) -> str:
    out = [say("fact_read", age=age(x["read_at"]) or None) if x.get("read_at") else say("fact_unread")]
    if age(x.get("at", "")):
        out.append(age(x["at"]))
    if x.get("about"):
        out.append(say("fact_about", about=label(x["about"])))
    return " · ".join(out)


def row_response(n: int, x: dict) -> dict:
    return {"n": n, "text": x.get("text", ""), "at": x.get("at", ""), "age": age(x.get("at", "")) if x.get("at") else "",
            "about": x.get("about") or "", "about_label": label(x.get("about") or ""),
            "read": bool(x.get("read_at")), "closed_at": x.get("read_at") or "", "meta": facts(x)}
