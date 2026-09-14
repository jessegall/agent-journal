from __future__ import annotations

import re
from pathlib import Path

import state
from pins import age
from templates import render

KEY = "comments"

KINDS = {"todo": "to-do", "doc": "doc", "pin": "pin", "rule": "rule", "reminder": "reminder", "suggestion": "suggestion",
         "inbox": "message"}

_REF = re.compile(r"^\s*(to-?dos?|docs?|pins?|rules?|reminders?|suggestions?|messages?|inbox)\s*[:#\s]\s*(\d+(?:\.\d+)?)\s*$", re.I)

MESSAGES = {
    "label": "{kind} {num}",
    "not_a_ref": "{text} is not something a comment can be about; write it as `todo 22`, `doc 4`, `pin 3`, "
                 "`rule 2`, `reminder 1` or `message 5`",
    "no_reminder": "there is no reminder {n} on this environment",
    "needs_text": 'a comment needs its text: journal comments add "todo 22" "<the comment>"',
    "added": "comment {n} on {label}; the agent is told at its next stop",
    "no_comment": "there is no comment {n}. `journal comments` numbers them.",
    "needs_how": 'say what was done about it: journal comments done {n} "<what was done>"',
    "already_done": "comment {n} was already handled: {how}",
    "done": "comment {n} on {label} is handled: {how}",
    "fact_done": "handled: {how}",
    "fact_told": "seen by the agent",
    "fact_new": "not seen yet",
    "fact_about": "on {label}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def parse_ref(text: str) -> tuple[str | None, str]:
    m = _REF.match(text or "")
    if not m:
        return None, say("not_a_ref", text=repr(text))
    word, num = m.group(1).lower().replace("-", ""), m.group(2)
    kind = "todo" if word.startswith("todo") else "inbox" if word in ("message", "messages", "inbox") else word.rstrip("s")
    if "." in num and kind != "doc":
        return None, say("not_a_ref", text=repr(text))
    return f"{kind}:{num}", ""


def label(ref: str) -> str:
    kind, _, num = ref.partition(":")
    return say("label", kind=KINDS.get(kind, kind), num=num)


def check_ref(root: Path, ref: str, track: str | None = None) -> str | None:
    kind, _, num = ref.partition(":")
    if kind == "reminder":
        import reminders
        n = int(num)
        return None if 1 <= n <= len(reminders._all(root, track)) else say("no_reminder", n=n)
    import questions
    return questions.check_ref(root, ref, track)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def add(root: Path, about: str, text: str, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, say("needs_text")
    ref, why = parse_ref(about)
    if ref is None:
        return False, why
    why = check_ref(root, ref, track)
    if why:
        return False, why
    with state.locked(root):
        items = _all(root, track)
        items.append({"text": text, "about": ref, "at": at, "source": source, "told_at": None,
                      "done": None, "done_at": None})
        _put(root, items, track)
        n = len(items)
    return True, say("added", n=n, label=label(ref))


def untold(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    return [(n, c) for n, c in enumerate(_all(root, track), 1) if not c.get("told_at") and not c.get("done")]


def mark_told(root: Path, track: str | None, ns: list[int], at: str) -> None:
    with state.locked(root):
        items = _all(root, track)
        for n in ns:
            if 1 <= n <= len(items):
                items[n - 1]["told_at"] = at
        _put(root, items, track)


def done(root: Path, n: int, how: str, at: str, track: str | None = None) -> tuple[bool, str]:
    how = " ".join((how or "").split())
    if not how:
        return False, say("needs_how", n=n)
    with state.locked(root):
        items = _all(root, track)
        if not 1 <= n <= len(items):
            return False, say("no_comment", n=n)
        c = items[n - 1]
        if c.get("done"):
            return False, say("already_done", n=n, how=c["done"])
        c["done"], c["done_at"] = how, at
        c.setdefault("told_at", at)
        _put(root, items, track)
    return True, say("done", n=n, label=label(c["about"]), how=how)


def facts(c: dict) -> str:
    out = [say("fact_about", label=label(c["about"]))]
    out.append(say("fact_done", how=c["done"]) if c.get("done") else say("fact_told") if c.get("told_at") else say("fact_new"))
    if age(c.get("at", "")):
        out.append(age(c.get("at", "")))
    return " · ".join(out)


def row_response(n: int, c: dict) -> dict:
    return {"n": n, "text": c.get("text", ""), "about": c.get("about", ""), "label": label(c.get("about", "")),
            "at": c.get("at", ""), "age": age(c.get("at", "")) if c.get("at") else "", "source": c.get("source", ""),
            "told": bool(c.get("told_at")), "done": c.get("done") or "", "meta": facts(c)}
