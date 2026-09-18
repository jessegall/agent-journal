from __future__ import annotations

from typing import Callable

_REGISTRY: list[tuple[int, int, str, Callable]] = []


def subject(name: str, priority: int):
    def wrap(fn: Callable) -> Callable:
        _REGISTRY.append((priority, len(_REGISTRY), name, fn))
        return fn
    return wrap


def ordered(conf: dict | None = None) -> list[tuple[str, Callable]]:
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
