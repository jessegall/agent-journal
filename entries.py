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


def all_of(root: Path, store: Store) -> list[dict]:
    got = state.get(root, store.key, [])
    return got if isinstance(got, list) else []


def live(root: Path, store: Store) -> list[dict]:
    return [e for e in all_of(root, store) if not e.get(store.retired)]


def rows(root: Path, store: Store, *, all_of_them: bool = False, cap: int | None = None,
         page: int = 1, order: str = "desc") -> tuple[list, int]:
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
    """
    import fmt
    items = all_of(root, store)
    kept = [(i, e) for i, e in enumerate(items, 1)
            if all_of_them or not e.get(store.retired)]
    shown, left = fmt.paged(kept, cap, page, order)
    facts = store.facts or (lambda e, n: [])
    return [fmt.Item(n=i, text=e[store.text], meta=" · ".join(facts(e, i)),
                     struck=bool(e.get(store.retired))) for i, e in shown], left


def _find(items: list[dict], n: int, store: Store) -> tuple[dict | None, str]:
    """The entry at that number, or the refusal that says why there is none."""
    if n < 1 or n > len(items):
        return None, f"there is no {store.noun} {n}. `journal {store.plural}` numbers them."
    e = items[n - 1]
    if e.get(store.retired):
        gone = e[store.retired]
        return None, f"{store.noun} {n} is already {store.verb or 'retired'}: {gone}"
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
        return False, (f'retiring {store.noun} {n} needs a reason: `journal {store.plural} '
                       f'{store.verb or "retire"} {n} "<why>"` — the text stays under --all, '
                       "so being wrong about it is cheap")
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
    return True, f"{store.verb or 'retired'} {store.noun} {n}: {said}\n  because: {why} ({standing} standing)"


def move(root: Path, store: Store, n: int, dst: str, at: str) -> tuple[bool, str]:
    """Carry an entry to another environment: retired here, standing there.

    STRUCK HERE AND ADDED THERE, never lifted out — see the module docstring. The retirement
    reason names the destination and its number on the far side, so the trail reads from
    both ends under `--all`.
    """
    import tracks
    dst = state.slug(dst)
    if not dst:
        return False, f'say where: `journal {store.plural} move {n} "<environment>"`'
    if dst not in tracks._all(root):
        return False, (f"no environment is called {dst!r}; `journal environments` lists them, "
                       "`journal prepare` makes one")
    with state.locked(root):
        items = all_of(root, store)
        e, refusal = _find(items, n, store)
        if e is None:
            return False, refusal
        there = state.tracked(root, store.key, dst, []) or []
        there.append({**e, "at": at, store.retired: None, "moved_from": n})
        items[n - 1][store.retired] = f"moved to `{dst}` as {store.noun} {len(there)}"
        state.put_tracked(root, store.key, dst, there)
        state.put(root, store.key, items)
    said = (e.get(store.text) or "")[:70]
    return True, f"{store.noun} {n} is {store.noun} {len(there)} on `{dst}`: {said}"
