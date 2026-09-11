"""Stray ideas: one line, global, no promise attached.

NEITHER A PIN NOR A TO-DO. A pin is a decided, standing fact; a to-do is committed work
someone will pick up, with the brief they will need. An idea is neither — it has no
owner, no brief, and no claim to being true or worth doing. It exists because "it might
be nice to build X later" was a message with a tag, gone the moment the transcript
compacted, and the only place left to put it was inventing a to-do for work nobody had
agreed to do yet or a pin for a fact nobody had decided.

GLOBAL, LIKE DOCS, RULES AND TOOLS. An idea belongs to the project, not to whichever
environment happened to be open when it was written down — the same reasoning that
keeps rules out of `environments/<name>/`. It lives in the record under its own
top-level key (`state.IN_RECORD`), read and written exactly like `rules` is: project-
wide, through `entries.py`'s shared retire/move loop.

LOW CEREMONY IS THE WHOLE POINT. `add` takes one line; there is no required brief, no
title, no track. Two ways out, both explicit: `drop` (it was tried, superseded, or not
worth it — same "reason required" rule every retirement here has) and `promote` (it
became real work, filed as a to-do on a named environment).
"""
from __future__ import annotations

from pathlib import Path

import entries
import fmt
import state
from pins import age

KEY = "ideas"


def _facts(i: dict, n: int) -> list[str]:
    out = []
    if i.get("dropped"):
        out.append(f"dropped: {i['dropped']}")
    if age(i.get("at", "")):
        out.append(age(i.get("at", "")))
    if i.get("promoted_to"):
        out.append(f"promoted to {i['promoted_to']}")
    return out


_STORE = entries.Store(key=KEY, noun="idea", text="text", retired="dropped",
                       verb="dropped", facts=_facts)


def _all(root: Path) -> list[dict]:
    got = state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def live(root: Path) -> list[dict]:
    return [i for i in _all(root) if not i.get("dropped")]


def add(root: Path, text: str, at: str, limit: int) -> tuple[bool, str]:
    """Write one down. Refuses a paragraph, same as a pin — this is a note, not a brief."""
    text = " ".join(text.split())
    if not text:
        return False, 'an idea is one line: journal ideas add "<the idea>"'
    if limit and len(text) > limit:
        return False, (
            f"{len(text)} characters, and an idea has {limit}. This is meant to be jotted "
            f"and moved past, not a brief:\n"
            f"  keep  {text[:limit - 20]}…\n"
            f"  cut   {text[limit - 20:][:120]}\n"
            "If it needs more than a line, it is a to-do, not an idea."
        )
    with state.locked(root):
        items = _all(root)
        items.append({"text": text, "at": at, "dropped": None})
        state.put(root, KEY, items)
        standing = len([i for i in items if not i.get("dropped")])
    return True, f"idea {len(items)} ({standing} standing)"


def drop(root: Path, n: int, why: str, at: str = "") -> tuple[bool, str]:
    """It was tried, superseded, or not worth doing. The reason is required, as ever."""
    return entries.retire(root, _STORE, n, why, at)


def promote(root: Path, n: int, at: str, track: str, title: str) -> tuple[bool, str]:
    """Turn idea n into a real to-do on a named environment. The idea is dropped, not
    copied — see `pins.promote`, the same shape for the same reason: one place holds
    the claim, and the retirement reason says where it went."""
    import todo
    title = " ".join((title or "").split())
    if not title:
        return False, f'promoting needs a title: journal ideas promote {n} --todo="<title>"'
    with state.locked(root):
        items = _all(root)
        if n < 1 or n > len(items):
            return False, f"there is no idea {n}. `journal ideas` numbers them."
        if items[n - 1].get("dropped"):
            return False, f"idea {n} is already dropped: {items[n - 1]['dropped']}"
        idea_text = items[n - 1]["text"]
    ok, msg = todo.add(root, track, title, f"From idea {n}: {idea_text}", at)
    if not ok:
        return False, msg
    with state.locked(root):
        items = _all(root)
        items[n - 1]["dropped"] = f"promoted to a to-do on `{track}`"
        items[n - 1]["promoted_to"] = track
        state.put(root, KEY, items)
    return True, f"idea {n} is now a to-do on `{track}`:\n  {msg}"


def listing(root: Path, *, all_of_them: bool = False, cap: int | None = None,
            page: int = 1, order: str = fmt.DESC):
    return entries.rows(root, _STORE, all_of_them=all_of_them, cap=cap, page=page, order=order)


def render(root: Path, *, all_of_them: bool = False, width: int | None = None,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    width = fmt.room(width)
    if not _all(root):
        return "  Nothing jotted down yet."
    items, left = listing(root, all_of_them=all_of_them, cap=cap, page=page, order=order)
    if not items:
        return "  Nothing standing. `journal ideas --all` shows the dropped ones."
    return fmt.render(fmt.Out(items=tuple(items))) + fmt.more(KEY, left, page, order)
