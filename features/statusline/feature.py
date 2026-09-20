from features.base import Feature
from features.statusline.gist import parsed, words
from features.statusline.spoken import spoken
from resources.types import COMMAND

GRAY, MUTED, RED, GREEN = "gray", "muted", "red", "green"
JOURNAL = "journal"
USING = "using"
VERBS = {"writes": "editing", "reads": "reading", "deletes": "deleting", "tests": "testing",
         "installs": "installing", "builds": "building", JOURNAL: "journalling", "": "running"}
NOUNS = {"writes": "files", "reads": "files", "deletes": "files", "tests": "tests", "installs": "dependencies"}
HELD = ("writes", "deletes", "tests")
TOUCHED = ("writes", "deletes")
NAMED = ("reads", "tests")
FLIP_EVERY = 1.0
HOLD = 1.0
LINGERS = 10.0
CLOCK_AFTER = 10.0
MOST = 12
NAME_CAP = 42
PLUS, MINUS = "+", "-"
COUNTS = ((PLUS, "added"), (MINUS, "removed"))


def by_hand(one: dict) -> bool:
    return (one.get(COMMAND.tool) or "Bash") != "Bash"


def piece_of(one: dict) -> dict:
    found = parsed(one.get(COMMAND.what) or "", spoken)[:1]
    return found[0] if found else {}


def kind_of(one: dict) -> str:
    said = one.get(COMMAND.effect) or ""
    if said or by_hand(one):
        return said
    return JOURNAL if piece_of(one).get("own") else ""


def capped(said: str) -> str:
    return said if len(said) <= NAME_CAP else f"{said[:NAME_CAP - 1].rstrip()}…"


def base(path: str) -> str:
    return path.rsplit("/", 1)[-1]


def touched(one: dict) -> list[str]:
    return [base(path) for path in one.get(COMMAND.files) or []]


def names_of(one: dict, kind: str) -> list[str]:
    if by_hand(one):
        return [one[COMMAND.subject]] if one.get(COMMAND.subject) else []
    if kind in TOUCHED:
        return touched(one)
    piece = piece_of(one)
    if not piece:
        return []
    if piece["own"]:
        return [piece["root"]]
    if kind in NAMED:
        return [base(piece["args"][0])] if piece["args"] else []
    return [piece["root"]]


def worked(group: list[dict], kind: str) -> list[str]:
    found: list[str] = []
    for one in group:
        for name in names_of(one, kind):
            if name not in found:
                found.append(name)
    return [capped(name) for name in found[-MOST:]]


def columns(found: list[str]) -> list[dict]:
    said = [words(name) for name in found]
    wide = max(len(w) for w in said)
    rows = [[*w, *([""] * (wide - len(w)))] for w in said]
    parts = []
    for i in range(wide):
        column = [row[i] for row in rows]
        if len(set(column)) > 1:
            parts.append({"value": column, "duration": FLIP_EVERY, "color": MUTED})
        elif column[0]:
            parts.append({"value": column[0], "color": MUTED})
    return parts


def verb_of(group: list[dict], kind: str) -> dict:
    said = USING if not kind and by_hand(group[-1]) else VERBS.get(kind, VERBS[""])
    return {"value": said, "color": GRAY}


def counted(group: list[dict]) -> list[dict]:
    totals = {sign: sum((one.get(COMMAND.changed) or {}).get(key, 0) for one in group) for sign, key in COUNTS}
    return [{"value": totals[sign], "prefix": sign, "increments": True, "color": color} for sign, color in ((PLUS, GREEN), (MINUS, RED)) if totals[sign]]


def outcome(result: dict) -> list[dict]:
    failed = result.get("failed")
    return [{"value": f"{failed} failed", "color": RED} if failed else {"value": "passed", "color": GREEN}]


def key_of(parts: list[dict]) -> str:
    return " ".join(p["value"] if isinstance(p["value"], str) else (p["value"][0] if p["value"] else "") for p in parts)


def message(group: list[dict], kind: str, closed: bool, now: float) -> dict:
    found = worked(group, kind)
    noun = NOUNS.get(kind)
    said = [verb_of(group, kind), *(columns(found) if found else [{"value": noun, "color": MUTED}] if noun else [])]
    last = group[-1]
    ended = float(last.get(COMMAND.done) or 0)
    result = last.get(COMMAND.result) or {}
    at = float(group[0].get(COMMAND.at) or 0)
    stopped = ended or float(last.get(COMMAND.at) or 0)
    ran = max(0.0, (stopped if closed or ended else now) - at)
    return {
        "key": key_of(said),
        "parts": [*said, *counted(group), *(outcome(result) if ended and result else [])],
        "at": at,
        "done": bool(closed or ended),
        "for": int(ran),
        "clock": ran >= CLOCK_AFTER,
        "hold": HOLD if kind in HELD else 0.0,
        "lingers": LINGERS,
    }


def runs(commands: list[dict]) -> list[tuple[str, list[dict]]]:
    grouped: list[tuple[str, list[dict]]] = []
    for one in commands:
        if not (one.get(COMMAND.what) or "").strip():
            continue
        kind = kind_of(one)
        if grouped and grouped[-1][0] == kind:
            grouped[-1][1].append(one)
            continue
        grouped.append((kind, [one]))
    return grouped


def queue(commands: list[dict] | None, now: float = 0.0) -> list[dict]:
    grouped = runs(commands or [])
    return [message(group, kind, i < len(grouped) - 1, now) for i, (kind, group) in enumerate(grouped)]


def bar(row, now: float = 0.0) -> dict:
    return {"queue": queue(row.commands, now)}


class StatusLine(Feature):
    name = "statusline"
    title_ = "What the status bar shows"
    abstract_ = "The journal says what the bar shows, in a queue of messages, and the viewer renders them in turn"
    help_ = "The agent's ring of commands is the record of what actually ran; nothing reaches the bar before it runs. Consecutive commands of one kind — editing, reading, deleting, testing, installing, building, journalling, running — make one message, whose verb is the root and only unmuted word. Every space is a part of its own, and only the part that differs between two names flips, one value a second. Editing, deleting and a test run hold their message a second when the next one arrives; the last message lingers ten seconds with nothing to replace it."
