from itertools import accumulate
from features.status_bar.dissect import MADE, TOUCHED
from features.status_bar.shell import words

GRAY, MUTED, RED, GREEN = "gray", "muted", "red", "green"
VERBS = {"writes": "editing", "creates": "creating", "reads": "reading", "deletes": "deleting", "tests": "testing",
         "installs": "installing", "builds": "building", "journal": "journalling", "git": "git", "": "running",
         "searches": "searching", "views": "viewing", "watches": "watching", "fetches": "fetching", "dispatches": "dispatching", "loads": "loading"}
NOUNS = {"reads": "files", "tests": "tests", "installs": "dependencies"}
HELD = ("writes", "deletes", "creates", "tests")
USING = "using"
PLUS, MINUS = "+", "-"
COUNTS = ((PLUS, "added"), (MINUS, "removed"))
FLIP_EVERY = 1.0
HOLD = 1.0
LINGERS = 10.0
CLOCK_AFTER = 10.0
MOST = 12
DRAIN = 10
DRAINING = 0.25


def worked(group: list[dict]) -> list[dict]:
    found: list[dict] = []
    running = dict.fromkeys(dict(COUNTS).values(), 0)
    for one in group:
        for key in running:
            running[key] += one["changed"].get(key, 0)
        for name in one["names"]:
            if any(name["value"] == was["value"] for was in found):
                continue
            found.append({**name, **running})
        if found:
            found[-1] = {**found[-1], **running}
    return found[-MOST:]


def shared(rows: list[list[str]]) -> int:
    for i in range(min(len(w) for w in rows)):
        if len({w[i] for w in rows}) > 1:
            return i
    return min(len(w) for w in rows)


def columns(found: list[dict]) -> list[dict]:
    rows = [[name["value"]] if name["whole"] else words(name["value"]) for name in found]
    if not all(name.get("columnar") for name in found) or len({len(w) for w in rows}) > 1:
        same = shared(rows)
        rows = [[*w[:same], " ".join(w[same:])] for w in rows]
    parts = []
    for column in zip(*rows):
        if len(set(column)) > 1:
            parts.append({"value": list(column), "duration": FLIP_EVERY, "color": MUTED})
        elif column[0]:
            parts.append({"value": column[0], "color": MUTED})
    return parts


def verb_for(group: list[dict], kind: str) -> dict:
    return {"value": USING if not kind and group[-1]["hand"] else VERBS.get(kind, VERBS[""]), "color": GRAY}


def counted(group: list[dict], found: list[dict]) -> list[dict]:
    if group[0]["kind"] not in (*TOUCHED, MADE) or not found:
        return []
    parts = []
    for (sign, key), color in zip(COUNTS, (GREEN, RED)):
        counts = list(accumulate(name.get(key, 0) for name in found))
        if not counts[-1]:
            continue
        value = counts if len(counts) > 1 else counts[0]
        parts.append({"value": value, "prefix": sign, "increments": True, "color": color,
                      **({"duration": FLIP_EVERY} if isinstance(value, list) else {})})
    return parts


def outcome(result: dict) -> list[dict]:
    if "ok" in result:
        return [{"value": "built", "color": GREEN} if result["ok"] else {"value": "failed", "color": RED}]
    failed = result.get("failed")
    return [{"value": f"{failed} failed", "color": RED} if failed else {"value": "passed", "color": GREEN}]


def key_of(parts: list[dict]) -> str:
    return " ".join(p["value"] if isinstance(p["value"], str) else (p["value"][0] if p["value"] else "") for p in parts)


def walked(parts: list[dict]) -> float:
    steps = max((len(p["value"]) for p in parts if isinstance(p["value"], list)), default=1)
    return steps * FLIP_EVERY if steps > 1 else 0.0


def message(group: list[dict], closed: bool, now: float, behind: int = 0) -> dict:
    kind = group[0]["kind"]
    found = worked(group)
    noun = NOUNS.get(kind)
    parts = [verb_for(group, kind), *(columns(found) if found else [{"value": noun, "color": MUTED}] if noun else [])]
    last = group[-1]
    over = closed or bool(last["done"])
    ran = max(0.0, (last["done"] if over else now) - last["at"])
    return {
        "id": group[0]["at"],
        "key": key_of(parts),
        "parts": [*parts, *counted(group, found), *(outcome(last["result"]) if last["done"] and last["result"] else [])],
        "at": group[0]["at"],
        "done": over,
        "for": int(ran),
        "clock": ran >= CLOCK_AFTER and not over,
        "hold": DRAINING if behind >= DRAIN else max(HOLD if kind in HELD else 0.0, walked(parts)),
        "lingers": LINGERS,
    }


def known(group: list[dict]) -> bool:
    return group[0]["kind"] not in TOUCHED or bool(worked(group))


def queue(groups: list[list[dict]], now: float = 0.0) -> list[dict]:
    known_groups = [group for group in groups if known(group)]
    return [message(group, i < len(known_groups) - 1, now, len(known_groups) - 1 - i) for i, group in enumerate(known_groups)]
