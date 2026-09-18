from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import entries
import fmt
import state
from pins import age
from templates import render as fill

KEY = "reminders"

MESSAGES = {
    "fact_retired": "retired: {why}",
    "fact_moved": "moved from {n}",
    "until": "until: {until}",
    "needs_text": 'remind you of what? one line: journal reminders add "<the instruction>"',
    "until_too_long": ("{length} characters, and a condition has {limit}. It is said back to you beside "
                       "the instruction at every stop, so it has to be the CONDITION and nothing else — "
                       "something you can judge true or false:\n  keep  …{keep}\n  cut   …{cut}\n"
                       "The reasoning behind it belongs in a pin or a doc."),
    "too_long": "{length} characters, and a reminder has {limit}. This is said again at every stop and "
                "every few tool calls, so it has to be the INSTRUCTION and nothing else:\n  keep  {keep}…\n"
                "  cut   {cut}\nThe reasoning behind it is a pin, or a doc. What repeats is the one line.",
    "added": "reminder {n} ({standing} standing) — said at every stop from now on",
    "added_until": "\n  until: {until}\n  you judge that yourself, and retire it when it reads true:"
                   '\n  journal reminders done {n} "<what made it true>"',
    "added_forever": '\n  it stands until you retire it: journal reminders done {n} "<why>"',
    "block_one": "REMINDER:",
    "block_many": "REMINDERS:",
    "none": "  Nothing is being repeated.",
    "updated": "reminder {n} now reads: {text}",
    "none_standing": "  Nothing is being repeated. `journal reminders --all` shows the retired ones.",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def _facts(r: dict, n: int) -> list[str]:
    out = []
    if r.get("done"):
        out.append(say("fact_retired", why=r["done"]))
    if age(r.get("at", "")):
        out.append(age(r.get("at", "")))
    if r.get("moved_from"):
        out.append(say("fact_moved", n=r["moved_from"]))
    if r.get("until"):
        out.append(say("until", until=r["until"]))
    return out


_STORE = entries.Store(key=KEY, noun="reminder", text="text", retired="done",
                       verb="retired", facts=_facts)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def live(root: Path, track: str | None = None) -> list[dict]:
    return [r for r in _all(root, track) if not r.get("done")]


def add(root: Path, text: str, at: str, limit: int, until: str = "") -> tuple[bool, str]:
    text = " ".join(text.split())
    until = " ".join((until or "").split())
    if not text:
        return False, say("needs_text")
    if over := entries.capped(text, limit):
        return False, say("too_long", length=over[0], limit=limit, keep=over[1], cut=over[2])
    # THE CONDITION IS REPEATED TOO, beside the text, at every stop. It was the one half of the line
    # with no cap on it, which is the same wall of text moved to the other side of the sentence.
    if over := entries.capped(until, limit):
        return False, say("until_too_long", length=over[0], limit=limit, keep=over[1], cut=over[2])
    made = {"text": text, "at": at, "until": until, "done": None}
    # THE RECORD IS SHARED: load and save under one lock, or two sessions adding at once
    # each write the other's away — the silent loss `pins.add` learned the hard way.
    with state.locked(root):
        items = _all(root)
        items.append(made)
        state.put(root, KEY, items)
        standing = len([r for r in items if not r.get("done")])
    tail = say("added_until", until=until, n=len(items)) if until else say("added_forever", n=len(items))
    return True, say("added", n=len(items), standing=standing) + tail


def done(root: Path, n: int, why: str, at: str = "") -> tuple[bool, str]:
    return entries.retire(root, _STORE, n, why, at)


def update(root: Path, n: int, text: str, until: str, limit: int) -> tuple[bool, str]:
    text = " ".join((text or "").split())
    until = " ".join((until or "").split())
    if not text:
        return False, say("needs_text")
    if over := entries.capped(text, limit):
        return False, say("too_long", length=over[0], limit=limit, keep=over[1], cut=over[2])
    if over := entries.capped(until, limit):
        return False, say("until_too_long", length=over[0], limit=limit, keep=over[1], cut=over[2])
    with state.locked(root):
        items = _all(root)
        r, why = entries._find(items, n, _STORE)
        if r is None:
            return False, why
        r["text"], r["until"] = text, until
        state.put(root, KEY, items)
    return True, say("updated", n=n, text=text)


def move(root: Path, n: int, dst: str, at: str) -> tuple[bool, str]:
    return entries.move(root, _STORE, n, dst, at)


def block(root: Path) -> str:
    items = live(root)
    if not items:
        return ""
    # A NUMBER IS FOR PICKING ONE OUT OF SEVERAL. With one standing it is furniture, and
    # the number that matters — the one `reminders done` takes — is the position in the
    # full list, which is what is printed here either way.
    out = [say("block_one" if len(items) == 1 else "block_many")]
    # THROUGH THE SAME RENDERER THE LIST USES, AND WITH AIR BETWEEN THE ITEMS. This built
    # its own lines and never wrapped one, so seven reminders arrived as seven unbroken
    # 180-character strings stacked with no gap — the user's word for it, twice now: a wall
    # of text. An instruction nobody can find the start of is not being delivered, however
    # reliably it is printed. `fmt.numbered` already wraps a numbered entry under its own
    # number and puts the meta beneath it; this is the same shape, so it is the same code.
    for i, r in enumerate(_all(root), 1):
        if r.get("done"):
            continue
        out.append(fmt.numbered(i, r["text"], say("until", until=r["until"]) if r.get("until") else ""))
    return "\n\n".join(out)


def listing(root: Path, *, all_of_them: bool = False, cap: int | None = None,
            page: int = 1, order: str = fmt.DESC, track: str | None = None):
    return entries.rows(root, _STORE, all_of_them=all_of_them, cap=cap, page=page,
                        order=order, track=track)


def rows_response(root: Path, *, all_of_them: bool = False, cap: int | None = None,
                  page: int = 1, order: str = fmt.DESC, track: str | None = None) -> tuple[list[dict], int]:
    items, left = listing(root, all_of_them=all_of_them, cap=cap, page=page, order=order, track=track)
    return [{"n": it.n, "text": it.text, "meta": it.meta, "struck": it.struck} for it in items], left


def render(root: Path, *, all_of_them: bool = False, width: int | None = None,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    width = fmt.room(width)
    if not _all(root):
        return say("none")
    rows, left = rows_response(root, all_of_them=all_of_them, cap=cap, page=page, order=order)
    if not rows:
        return say("none_standing")
    items = [fmt.Item(n=r["n"], text=r["text"], meta=r["meta"], struck=r["struck"]) for r in rows]
    return fmt.render(fmt.Out(items=tuple(items))) + fmt.more(KEY, left, page, order)
