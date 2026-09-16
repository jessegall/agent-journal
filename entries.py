"""One retire and one move, for every numbered store that has them.

FOUR COPIES OF THE SAME FUNCTION IS FOUR PLACES TO FIX A WORDING. `pins.strike`,
`pins.move`, `reminders.done` and `reminders.move` were written out separately and had
already drifted the way copies do: one truncated the entry at 60 characters and another at
70, one checked the destination existed and another did not, and the refusals said the same
thing four different ways. A fifth noun would have been a fifth copy.

WHAT ACTUALLY DIFFERS between them is small and nameable, so it is named: the key the store
lives under, the noun as a reader says it, the field holding the text, and the field that
marks an entry retired. Everything else — the lock, the number, the refusal when there is
no such entry, the refusal when it is already retired, struck-here-and-added-there, the
sentence that comes back — is one implementation.

THE NUMBER IS THE POSITION IN THE FULL LIST, in every store, and that is why a move never
lifts an entry out: renumbering would make "pin 7" in an old transcript name a different
fact. The source entry is retired in place and says where it went.

WHAT IS NOT HERE. A to-do is a file on disk and a doc moves only its `track:` field; those
are different operations wearing the same word, and pretending otherwise would be a funnel
in name that branched on `kind` in the body. They share the refusals below and nothing else.
"""
from __future__ import annotations

from pathlib import Path
from typing import NamedTuple

import state
from templates import render as fill


MESSAGES = {
    "no_such": "there is no {noun} {n}. `journal {plural}` numbers them.",
    "already": "{noun} {n} is already {verb}: {gone}",
    "needs_reason": 'retiring {noun} {n} needs a reason: `journal {plural} {verb} {n} "<why>"` — the text stays under '
                    "--all, so being wrong about it is cheap",
    "retired": "{verb} {noun} {n}: {said}\n  because: {why} ({standing} standing)",
    "retired_verb": "retired",
    "retire_verb": "retire",
    "move_where": 'say where: `journal {plural} move {n} "<environment>"`',
    "move_none": "no environment is called {dst}; `journal environments` lists them, `journal prepare` makes one",
    "moved_to": "moved to `{dst}` as {noun} {n}",
    "moved": "{noun} {n} is {noun} {to} on `{dst}`: {said}",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


class Store(NamedTuple):
    """What a numbered store is, to the two operations that treat them all alike."""
    key: str            # where the list lives (`state.get`/`put`, and `state.tracked`)
    noun: str           # what a reader calls one, singular
    text: str           # the field holding what the entry says
    retired: str        # the field that holds the reason it is no longer standing
    verb: str = ""      # what retiring is called here; defaults to "retired"
    #: THE ONE THING A LISTING CANNOT SHARE: what a reader is told BENEATH an entry. A pin
    #: cites the line it was written at and what it replaced; a reminder shows its condition
    #: and where it moved from. So the loop is shared and the facts are a strategy — the
    #: store supplies them, and `rows` never asks which store it is holding.
    facts: object = None   # (entry, number) -> list[str], the fragments under the text

    @property
    def plural(self) -> str:
        return self.key


def capped(text: str, limit: int) -> tuple[int, str, str] | None:
    """(length, what fits, what overflows) when `text` is over `limit`, else None.

    FOUR STORES CAP A LINE and each sliced it out by hand — a pin's claim, a question's
    title, a reminder's instruction twice over — with the same `limit - 20` and the same
    120-character tail copied four times. What differs between them is the SENTENCE, and
    each still writes its own; the arithmetic is one place, so a change to how a cut is
    shown cannot land in three of the four.

    The refusal SHOWS THE OVERFLOW rather than truncating: a claim silently cut in half is
    a fact that reads as complete and is not.
    """
    if not limit or len(text) <= limit:
        return None
    return len(text), text[:limit - 20], text[limit - 20:][:120]


def all_of(root: Path, store: Store, *, track: str | None = None) -> list[dict]:
    """Every entry in the store — the CURRENT environment, or a named one.

    `track` reads a store OTHER than the one this process is on, through
    `state.tracked`, for a store that is actually per-environment (`state.TRACKED`).
    Rules are not: they bind every environment, so a track naming one is ignored and
    this falls back to the plain project-wide read.
    """
    if track and store.key in state.TRACKED:
        got = state.tracked(root, store.key, track, [])
    else:
        got = state.get(root, store.key, [])
    return got if isinstance(got, list) else []


def live(root: Path, store: Store, *, track: str | None = None) -> list[dict]:
    return [e for e in all_of(root, store, track=track) if not e.get(store.retired)]


def listing(items: list, item_of, *, cap: int | None = None, page: int = 1,
            order: str = "desc") -> tuple[list, int]:
    """(the rows, how many were left off) — for a noun that already HAS its items.

    THE HALF THAT EVERY NUMBERED LISTING SHARES, once loading is out of the way: page
    them, then turn what is left into a row. `todo.render`, `docs.catalogue` and
    `tools.catalogue` were each `fmt.paged` followed by a hand-written loop that built a
    meta string and called `fmt.numbered` itself — the same shape `rows` below already
    was for pins, rules and reminders, just written out three more times because a to-do
    is a file and a doc is a folder of parts and neither loads the way a pin does.

    THAT IS THE WHOLE SPLIT. Loading cannot be shared — see the module docstring — so it
    is not asked to be: this takes the items as given, and `item_of` is the caller's own
    `facts` strategy, closed over whatever the row needs (an environment, a doc lookup,
    an age), producing the `fmt.Item` the renderer lays out. `rows` is `listing` with the
    one loading a numbered STORE still needs, and now delegates to it.
    """
    import fmt
    shown, left = fmt.paged(items, cap, page, order)
    return [item_of(e) for e in shown], left


def rows(root: Path, store: Store, *, all_of_them: bool = False, cap: int | None = None,
         page: int = 1, order: str = "desc", track: str | None = None) -> tuple[list, int]:
    """(the entries as rows, how many were left off). The listing every numbered store shares.

    ONE LOOP, THREE NOUNS, AND NOTHING ABOUT WHAT EACH IS VISIBLE TO. A pin and a
    reminder each belong to one environment; a rule belongs to the project. That is
    decided by where each is stored, never by who renders it.

    IT WAS WRITTEN OUT ONCE PER NOUN and had drifted exactly as `retire` and `move` had:
    the same enumerate, the same paging, the same struck-keeps-its-number rule, the same
    `fmt.numbered` call, in two functions that differed only in which fields went into the
    line beneath. A third noun would have been a third copy.

    THE NUMBER IS THE POSITION IN THE FULL LIST, always — a retired entry keeps its number
    and is simply not shown. Renumbering the standing ones would make "pin 3" in an old
    transcript name a different fact.

    `track` reads another environment's store instead of the current one — see `all_of`.
    """
    import fmt
    items = all_of(root, store, track=track)
    kept = [(i, e) for i, e in enumerate(items, 1)
            if all_of_them or not e.get(store.retired)]
    facts = store.facts or (lambda e, n: [])
    return listing(kept, lambda pair: fmt.Item(
        n=pair[0], text=pair[1][store.text], meta=" · ".join(facts(pair[1], pair[0])),
        struck=bool(pair[1].get(store.retired))), cap=cap, page=page, order=order)


def _find(items: list[dict], n: int, store: Store) -> tuple[dict | None, str]:
    """The entry at that number, or the refusal that says why there is none."""
    if n < 1 or n > len(items):
        return None, say("no_such", noun=store.noun, n=n, plural=store.plural)
    e = items[n - 1]
    if e.get(store.retired):
        gone = e[store.retired]
        return None, say("already", noun=store.noun, n=n, verb=store.verb or say("retired_verb"), gone=gone)
    return e, ""


def retire(root: Path, store: Store, n: int, why: str, at: str = "") -> tuple[bool, str]:
    """Take an entry out of the standing list, with the reason that is always required.

    THE REASON IS THE WHOLE SAFEGUARD, and it is the same safeguard in every store. Nothing
    here expires on a counter or a date: an entry that vanished without somebody saying what
    changed is indistinguishable from one that was never written. It HIDES rather than
    erases — `--all` still shows it — so being wrong costs one line to undo, and that is
    what makes retiring something cheap enough to actually do.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, say("needs_reason", noun=store.noun, n=n, plural=store.plural,
                          verb=store.verb or say("retire_verb"))
    with state.locked(root):
        items = all_of(root, store)
        e, refusal = _find(items, n, store)
        if e is None:
            return False, refusal
        e[store.retired] = why
        if at:
            e.setdefault(f"{store.retired}_at", at)
        state.put(root, store.key, items)
        standing = len([x for x in items if not x.get(store.retired)])
    said = (e.get(store.text) or "")[:70]
    return True, say("retired", verb=store.verb or say("retired_verb"), noun=store.noun, n=n, said=said, why=why,
                     standing=standing)


def move(root: Path, store: Store, n: int, dst: str, at: str) -> tuple[bool, str]:
    """Carry an entry to another environment: retired here, standing there.

    STRUCK HERE AND ADDED THERE, never lifted out — see the module docstring. The retirement
    reason names the destination and its number on the far side, so the trail reads from
    both ends under `--all`.
    """
    import tracks
    dst = state.slug(dst)
    if not dst:
        return False, say("move_where", plural=store.plural, n=n)
    if dst not in tracks._all(root):
        return False, say("move_none", dst=repr(dst))
    with state.locked(root):
        items = all_of(root, store)
        e, refusal = _find(items, n, store)
        if e is None:
            return False, refusal
        there = state.tracked(root, store.key, dst, []) or []
        there.append({**e, "at": at, store.retired: None, "moved_from": n})
        items[n - 1][store.retired] = say("moved_to", dst=dst, noun=store.noun, n=len(there))
        state.put_tracked(root, store.key, dst, there)
        state.put(root, store.key, items)
    said = (e.get(store.text) or "")[:70]
    return True, say("moved", noun=store.noun, n=n, to=len(there), dst=dst, said=said)
