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
    if not limit or len(text) <= limit:
        return None
    return len(text), text[:limit - 20], text[limit - 20:][:120]


def all_of(root: Path, store: Store, *, track: str | None = None) -> list[dict]:
    if track and store.key in state.TRACKED:
        got = state.tracked(root, store.key, track, [])
    else:
        got = state.get(root, store.key, [])
    return got if isinstance(got, list) else []


def live(root: Path, store: Store, *, track: str | None = None) -> list[dict]:
    return [e for e in all_of(root, store, track=track) if not e.get(store.retired)]


def listing(items: list, item_of, *, cap: int | None = None, page: int = 1,
            order: str = "desc") -> tuple[list, int]:
    import fmt
    shown, left = fmt.paged(items, cap, page, order)
    return [item_of(e) for e in shown], left


def rows(root: Path, store: Store, *, all_of_them: bool = False, cap: int | None = None,
         page: int = 1, order: str = "desc", track: str | None = None) -> tuple[list, int]:
    import fmt
    items = all_of(root, store, track=track)
    kept = [(i, e) for i, e in enumerate(items, 1)
            if all_of_them or not e.get(store.retired)]
    facts = store.facts or (lambda e, n: [])
    return listing(kept, lambda pair: fmt.Item(
        n=pair[0], text=pair[1][store.text], meta=" · ".join(facts(pair[1], pair[0])),
        struck=bool(pair[1].get(store.retired))), cap=cap, page=page, order=order)


def _find(items: list[dict], n: int, store: Store) -> tuple[dict | None, str]:
    if n < 1 or n > len(items):
        return None, say("no_such", noun=store.noun, n=n, plural=store.plural)
    e = items[n - 1]
    if e.get(store.retired):
        gone = e[store.retired]
        return None, say("already", noun=store.noun, n=n, verb=store.verb or say("retired_verb"), gone=gone)
    return e, ""


def retire(root: Path, store: Store, n: int, why: str, at: str = "") -> tuple[bool, str]:
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
