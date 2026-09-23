from features.status_bar.group import grouped, ran
from features.status_bar.queue import queue

EMPTY = {"queue": []}


def bar(row, now: float = 0.0) -> dict:
    return {"queue": queue(grouped(ran(row.commands)), now)}


def current(record) -> dict:
    return record.state("status_bar").get("bar", EMPTY)
