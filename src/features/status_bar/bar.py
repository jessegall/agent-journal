from features.status_bar.group import grouped, ran
from features.status_bar.queue import part_text, queue

EMPTY = {"queue": []}


def bar(row, now: float = 0.0) -> dict:
    return {"queue": queue(grouped(ran(row.commands)), now)}


def doing(row, now: float = 0.0) -> str:
    """The plain line for what an agent does now or did last, as the bar words it: the verb and what it touched, such as "Reading orchestra.js"."""
    latest = queue(grouped(ran(row.commands)), now)[-1:]
    return " ".join(part_text(part) for one in latest for part in one["parts"] if part_text(part))


def current(record) -> dict:
    return record.state("status_bar").get("bar", EMPTY)
