from features.statusline.shell import words

GRAY, MUTED, RED, GREEN = "gray", "muted", "red", "green"
VERBS = {"writes": "editing", "reads": "reading", "deletes": "deleting", "tests": "testing",
         "installs": "installing", "builds": "building", "journal": "journalling", "git": "git", "": "running",
         "searches": "searching", "fetches": "fetching", "dispatches": "dispatching", "loads": "loading"}
NOUNS = {"reads": "files", "tests": "tests", "installs": "dependencies"}
HELD = ("writes", "deletes", "tests")
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
    for one in group:
        for name in one["names"]:
            if not any(name["value"] == was["value"] for was in found):
                found.append(name)
    return found[-MOST:]


def shared(said: list[list[str]]) -> int:
    for i in range(min(len(w) for w in said)):
        if len({w[i] for w in said}) > 1:
            return i
    return min(len(w) for w in said)


def columns(found: list[dict]) -> list[dict]:
    said = [[name["value"]] if name["whole"] else words(name["value"]) for name in found]
    if len({len(w) for w in said}) > 1:
        same = shared(said)
        said = [[*w[:same], " ".join(w[same:])] for w in said]
    parts = []
    for column in zip(*said):
        if len(set(column)) > 1:
            parts.append({"value": list(column), "duration": FLIP_EVERY, "color": MUTED})
        elif column[0]:
            parts.append({"value": column[0], "color": MUTED})
    return parts


def verb_for(group: list[dict], kind: str) -> dict:
    return {"value": USING if not kind and group[-1]["hand"] else VERBS.get(kind, VERBS[""]), "color": GRAY}


def counted(group: list[dict]) -> list[dict]:
    if group[0]["kind"] not in HELD[:2]:
        return []
    totals = {sign: sum(one["changed"].get(key, 0) for one in group) for sign, key in COUNTS}
    return [{"value": totals[sign], "prefix": sign, "increments": True, "color": color}
            for sign, color in ((PLUS, GREEN), (MINUS, RED)) if totals[sign]]


def outcome(result: dict) -> list[dict]:
    failed = result.get("failed")
    return [{"value": f"{failed} failed", "color": RED} if failed else {"value": "passed", "color": GREEN}]


def key_of(parts: list[dict]) -> str:
    return " ".join(p["value"] if isinstance(p["value"], str) else (p["value"][0] if p["value"] else "") for p in parts)


def walked(parts: list[dict]) -> float:
    steps = max((len(p["value"]) for p in parts if isinstance(p["value"], list)), default=1)
    return steps * FLIP_EVERY if steps > 1 else 0.0


def waited(kind: str, last: dict) -> list[dict]:
    if kind in HELD[:2] and not last["done"]:
        return [{"value": "", "pending": True, "color": MUTED}]
    return [{"value": NOUNS[kind], "color": MUTED}] if kind in NOUNS else []


def message(group: list[dict], closed: bool, now: float, waiting: int = 0) -> dict:
    kind = group[0]["kind"]
    found = worked(group)
    last = group[-1]
    said = [verb_for(group, kind), *(columns(found) if found else waited(kind, last))]
    last = group[-1]
    over = closed or bool(last["done"])
    ran = max(0.0, (last["done"] if over else now) - last["at"])
    return {
        "id": group[0]["at"],
        "key": key_of(said),
        "parts": [*said, *counted(group), *(outcome(last["result"]) if last["done"] and last["result"] else [])],
        "at": group[0]["at"],
        "done": over,
        "for": int(ran),
        "clock": ran >= CLOCK_AFTER and not over,
        "hold": DRAINING if waiting >= DRAIN else max(HOLD if kind in HELD else 0.0, walked(said)),
        "lingers": LINGERS,
        "pending": any(p.get("pending") for p in said),
    }


def queue(groups: list[list[dict]], now: float = 0.0) -> list[dict]:
    return [message(group, i < len(groups) - 1, now, len(groups) - 1 - i) for i, group in enumerate(groups)]
