from features.base import Feature
from features.statusline.gist import names
from features.statusline.spoken import spoken
from resources.types import COMMAND, RUNNING

GRAY, MUTED, RED, GREEN = "gray", "muted", "red", "green"
RIGHT = "right"
HELD = ("writes", "deletes", "tests")
VERBS = {"writes": "editing", "reads": "reading", "deletes": "deleting", "tests": "testing",
         "installs": "installing", "builds": "building", "": "running"}
USING = "using"
FILED = ("writes", "deletes")
NOUNS = {"writes": "files", "reads": "files", "deletes": "files", "tests": "tests", "installs": "dependencies"}
ROLL_EVERY = 0.5
HOLD = 1.0
LINGERS = 10.0
CLOCK_AFTER = 10.0
MOST = 12
NAME_CAP = 42
VERBED = ("reading", "editing", "writing", "searching", "dispatching", "fetching", "loading")


JOURNAL = "journal"


def kind_of(one: dict) -> str:
    said = one.get(COMMAND.effect) or ""
    return JOURNAL if not said and speaks_for_itself(one) else said


def speaks_for_itself(one: dict) -> bool:
    if by_hand(one):
        return False
    said = names(one.get(COMMAND.what) or "", spoken)[:1]
    return bool(said) and said[0]["own"]


def capped(said: str) -> str:
    return said if len(said) <= NAME_CAP else f"{said[:NAME_CAP - 1].rstrip()}…"


def by_hand(one: dict) -> bool:
    return (one.get(COMMAND.tool) or "Bash") != "Bash"


def named(one: dict) -> list[dict]:
    what = (one.get(COMMAND.what) or "").strip()
    if not what:
        return []
    if by_hand(one):
        said = what.split(" ", 1)
        return [{"value": capped(said[1] if len(said) > 1 and said[0] in VERBED else what), "own": False}]
    first = names(what, spoken)[:1]
    return [{**name, "value": capped(name["value"])} for name in first]


def files_of(one: dict) -> list[dict]:
    return [{"value": capped(path.rsplit("/", 1)[-1]), "own": False} for path in one.get(RUNNING.files) or []]


def worked(one: dict, kind: str) -> list[dict]:
    if kind not in FILED:
        return named(one)
    return files_of(one) if not by_hand(one) else named(one)


def working(run: dict, commands: list) -> list[dict]:
    kind = kind_of(run)
    seen: list[dict] = []
    for one in [*(commands or []), run]:
        if kind_of(one) != kind:
            continue
        for name in worked(one, kind):
            if not any(name["value"] == was["value"] for was in seen):
                seen.append(name)
    return seen[-MOST:]


def flipping(found: list[dict]) -> list[dict]:
    return [{"value": [name["value"] for name in found], "duration": ROLL_EVERY, "color": MUTED, "align": RIGHT}] if found else []


def outcome(result: dict) -> list[dict]:
    failed = result.get("failed")
    return [{"value": f"{failed} failed", "color": RED} if failed else {"value": "passed", "color": GREEN}]


def verb_for(run: dict, found: list[dict]) -> list[dict]:
    kind = kind_of(run)
    if kind == JOURNAL:
        return []
    return [{"value": USING if not kind and by_hand(run) else VERBS[kind], "color": GRAY}]


def parts_for(run: dict, commands: list) -> list[dict]:
    found = working(run, commands)
    said = verb_for(run, found)
    if found:
        return [*said, *flipping(found)]
    noun = NOUNS.get(kind_of(run))
    return [*said, *([{"value": noun, "color": MUTED}] if noun else [])]


def key_of(parts: list[dict]) -> str:
    return " ".join(p["value"] if isinstance(p["value"], str) else (p["value"][0] if p["value"] else "") for p in parts)


def line(run: dict, commands: list | None = None, now: float = 0.0) -> dict:
    if not run or not run.get(RUNNING.what):
        return {}
    said = parts_for(run, commands or [])
    if not said:
        return {}
    done = float(run.get(RUNNING.done) or 0)
    result = run.get(RUNNING.result) or {}
    ran = max(0.0, (done or now or 0) - float(run.get(RUNNING.at) or 0))
    return {
        "key": key_of(said),
        "parts": [*said, *(outcome(result) if done and result else [])],
        "at": run.get(RUNNING.at) or 0,
        "done": bool(done),
        "for": int(ran),
        "clock": ran >= CLOCK_AFTER,
        "hold": HOLD if kind_of(run) in HELD else 0.0,
        "lingers": LINGERS,
    }


def said_once(run: dict) -> dict:
    said = parts_for(run, [])
    return {"at": run.get(RUNNING.at) or 0, "key": key_of(said), "parts": said} if said else {}


def bar(row, now: float = 0.0) -> dict:
    return {"line": line(row.running, row.commands, now), "commands": [c for c in (said_once(one) for one in row.commands or []) if c]}


class StatusLine(Feature):
    name = "statusline"
    title_ = "What the status bar shows"
    abstract_ = "The journal says what the bar shows, what it flips through and how long it lingers; the viewer renders it"
    help_ = "Every line is what the agent is doing — running, reading, editing, testing, installing, building — and the names it works through, flipping every half second: the files for a file tool, the command and its subcommand for a shell. Editing, deleting and a test run hold their line a second so their counts and outcome can be read; a line with nothing to replace it stays ten seconds."
