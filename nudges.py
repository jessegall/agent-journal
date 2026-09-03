"""nudges — the stop queue's subjects, in priority order.

ONE SUBJECT PER STOP, EACH ONCE PER TURN, PENDING UNTIL RESOLVED. When the agent stops
with several things owed — no loop running, work open, to-dos waiting — the hook does not
say them all at once, because a wall of reminders is read past as one. It raises the
first, the agent acts, the next stop raises the next, and so on until the queue drains.

WHICH COMES FIRST IS A NUMBER. Every subject registers with a priority, lowest first, and
the cheap, enabling things go first: a session on a taken environment has to move before it
does anything; a loop is one command and everything after it depends on a session that
stays awake; a context decision is the safety of the whole transcript; a tag is one word;
open work and the to-do list are the long tail. To reorder, change the number — in code
(`@nudges.subject("work", 5)`) or per project (`stop_priority` in settings.json:
{"work": 5} puts open work first). Registration order breaks ties.

A subject is a function `(conf, ctx, lines, stretch, here, active)` that returns None
when nothing is pending, a `(label, one-line brief[, details])` tuple for a hold, or
`("context-only", text)` for a line said rather than held.
"""
from __future__ import annotations

from typing import Callable

_REGISTRY: list[tuple[int, int, str, Callable]] = []


def subject(name: str, priority: int):
    """Register a stop subject under `name` at `priority` (lower runs first)."""
    def wrap(fn: Callable) -> Callable:
        _REGISTRY.append((priority, len(_REGISTRY), name, fn))
        return fn
    return wrap


def ordered(conf: dict | None = None) -> list[tuple[str, Callable]]:
    """(name, pending) for every subject, in the order the queue runs them."""
    over = _over(conf)
    rows = sorted(_REGISTRY, key=lambda r: (_num(over.get(r[2]), r[0]), r[1]))
    return [(name, fn) for _, _, name, fn in rows]


def _over(conf: dict | None) -> dict:
    over = (conf or {}).get("stop_priority") or {}
    if not isinstance(over, dict):
        return {}
    if "track" in over and "environment" not in over:   # the old name of the subject
        over = {**over, "environment": over["track"]}
    return over


def names(conf: dict | None = None) -> list[str]:
    return [n for n, _ in ordered(conf)]


def priorities(conf: dict | None = None) -> list[tuple[str, int]]:
    over = _over(conf)
    return [(name, _num(over.get(name), p)) for p, _, name, _ in
            sorted(_REGISTRY, key=lambda r: (_num(over.get(r[2]), r[0]), r[1]))]


def _num(v, default: int) -> int:
    try:
        return int(v) if v is not None else default
    except (TypeError, ValueError):
        return default
