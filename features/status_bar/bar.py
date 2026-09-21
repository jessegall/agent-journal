import time
from pathlib import Path

from engine.stored import read_json, write_json
from features.status_bar.group import grouped, ran
from features.status_bar.queue import queue

EMPTY = {"queue": []}


def bar(row, now: float = 0.0) -> dict:
    return {"queue": queue(grouped(ran(row.commands)), now)}


def bar_file(root, env: str) -> Path:
    return Path(root) / "runtime" / f"bar-{env}.json"


def played_file(root, env: str) -> Path:
    return Path(root) / "runtime" / f"bar-played-{env}.json"


def played(root, env: str, at: float) -> None:
    write_json(played_file(root, env), {"at": at})


def shown(root, env: str) -> dict:
    last = read_json(played_file(root, env), {}).get("at", 0.0)
    held = read_json(bar_file(root, env), EMPTY)
    return {**held, "queue": [one for one in held["queue"] if one["at"] > last or (one["at"] == last and not ended(one))]}


def ended(one: dict) -> bool:
    return bool(one["done"]) and time.time() >= one["at"] + one.get("for", 0) + one.get("lingers", 0)
