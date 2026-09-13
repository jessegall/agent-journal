from __future__ import annotations

from pathlib import Path

import entries
import fmt
import state
from pins import age
from templates import render

KEY = "ideas"

MESSAGES = {
    "fact_dropped": "dropped: {why}",
    "fact_promoted": "promoted to {track}",
    "needs_text": 'an idea is one line: journal ideas add "<the idea>"',
    "too_long": "{length} characters, and an idea has {limit}. This is meant to be jotted and moved "
                "past, not a brief:\n  keep  {keep}…\n  cut   {cut}\nIf it needs more than a line, it is "
                "a to-do, not an idea.",
    "added": "idea {n} ({standing} standing)",
    "needs_title": 'promoting needs a title: journal ideas promote {n} --title="<to-do title>"',
    "no_idea": "there is no idea {n}. `journal ideas` numbers them.",
    "already_dropped": "idea {n} is already dropped: {why}",
    "from_idea": "From idea {n}: {text}",
    "promoted_reason": "promoted to a to-do on `{track}`",
    "promoted": "idea {n} is now a to-do on `{track}`:\n  {said}",
}


def say(key: str, **values) -> str:
    return render(MESSAGES[key], **values)


def _facts(i: dict, n: int) -> list[str]:
    out = []
    if i.get("dropped"):
        out.append(say("fact_dropped", why=i["dropped"]))
    if age(i.get("at", "")):
        out.append(age(i.get("at", "")))
    if i.get("promoted_to"):
        out.append(say("fact_promoted", track=i["promoted_to"]))
    return out


_STORE = entries.Store(key=KEY, noun="idea", text="text", retired="dropped",
                       verb="dropped", facts=_facts)


def _all(root: Path) -> list[dict]:
    return entries.all_of(root, _STORE)


def live(root: Path) -> list[dict]:
    return [i for i in _all(root) if not i.get("dropped")]


def add(root: Path, text: str, at: str, limit: int) -> tuple[bool, str]:
    text = " ".join(text.split())
    if not text:
        return False, say("needs_text")
    if limit and len(text) > limit:
        return False, say("too_long", length=len(text), limit=limit,
                          keep=text[:limit - 20], cut=text[limit - 20:][:120])
    with state.locked(root):
        items = _all(root)
        items.append({"text": text, "at": at, "dropped": None})
        state.put(root, KEY, items)
        standing = len([i for i in items if not i.get("dropped")])
    return True, say("added", n=len(items), standing=standing)


def drop(root: Path, n: int, why: str, at: str = "") -> tuple[bool, str]:
    return entries.retire(root, _STORE, n, why, at)


def promote(root: Path, n: int, at: str, track: str, title: str) -> tuple[bool, str]:
    import todo
    title = " ".join((title or "").split())
    if not title:
        return False, say("needs_title", n=n)
    with state.locked(root):
        items = _all(root)
        if n < 1 or n > len(items):
            return False, say("no_idea", n=n)
        if items[n - 1].get("dropped"):
            return False, say("already_dropped", n=n, why=items[n - 1]["dropped"])
        idea_text = items[n - 1]["text"]
    ok, msg = todo.add(root, track, title, say("from_idea", n=n, text=idea_text), at)
    if not ok:
        return False, msg
    with state.locked(root):
        items = _all(root)
        items[n - 1]["dropped"] = say("promoted_reason", track=track)
        items[n - 1]["promoted_to"] = track
        state.put(root, KEY, items)
    return True, say("promoted", n=n, track=track, said=msg)


def listing(root: Path, *, all_of_them: bool = False, cap: int | None = None,
            page: int = 1, order: str = fmt.DESC):
    return entries.rows(root, _STORE, all_of_them=all_of_them, cap=cap, page=page, order=order)
