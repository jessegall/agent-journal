import time

from features.status_bar.group import grouped, ran
from features.status_bar.queue import queue

EMPTY = {"queue": []}


def bar(row, now: float = 0.0) -> dict:
    return {"queue": queue(grouped(ran(row.commands)), now)}


def played(record, at: float) -> None:
    record.state("status_bar").set("played", at)


def current(record) -> dict:
    state = record.state("status_bar")
    last, held = state.get("played", 0.0), state.get("bar", EMPTY)
    return {**held, "queue": [one for one in held["queue"] if one["at"] > last or (one["at"] == last and not ended(one))]}


def ended(one: dict) -> bool:
    return bool(one["done"]) and time.time() >= one["at"] + one.get("for", 0) + one.get("lingers", 0)
