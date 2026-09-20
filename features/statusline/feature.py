from features.base import Feature
from features.statusline.gist import gist, gist_tokens
from features.statusline.spoken import spoken
from resources.types import COMMAND, RUNNING

HELD = ("writes", "deletes", "tests")
SCOPED = (*HELD, "installs", "builds", "reads")
VERBS = {"tests": "running", "deletes": "deleting", "writes": "editing", "reads": "reading",
         "installs": "installing", "builds": "building"}
NOUNS = {"tests": "tests", "deletes": "files", "writes": "files", "reads": "files", "installs": "dependencies"}
GRAY, MUTED, RED, GREEN = "gray", "muted", "red", "green"
LEFT, RIGHT = "left", "right"
ROLL_EVERY = 0.5
HOLD = 1.0
CLOCK_AFTER = 10.0
MOST_STEPS = 12
NAME_CAP = 42


def scoped(run: dict) -> bool:
    return run.get(RUNNING.effect) in SCOPED


def own_words(run: dict) -> bool:
    return bool(run.get(RUNNING.tool)) and run.get(RUNNING.tool) != "Bash"


def parted(tokens: list[dict]) -> list[dict]:
    return [{"value": t["value"], "color": GRAY if t["kind"] == "command" else MUTED} for t in tokens]


def gisted(run: dict) -> list[dict]:
    what = run.get(RUNNING.what) or ""
    return parted(gist_tokens(what if own_words(run) else gist(what, spoken)))


def named(run: dict) -> list[dict]:
    verb = VERBS.get(run.get(RUNNING.effect) or "")
    return [{"value": verb, "color": GRAY}] if verb else []


def capped(said: str) -> str:
    return said if len(said) <= NAME_CAP else f"{said[:NAME_CAP - 1].rstrip()}…"


def shown(one: dict) -> str:
    what = (one.get(COMMAND.what) or "").strip()
    if not what or not one.get(COMMAND.tool) or one.get(COMMAND.tool) == "Bash":
        return ""
    return capped(what.split(" ", 1)[-1] if " " in what else what)


def flipping(run: dict, commands: list) -> list[dict]:
    effect = run.get(RUNNING.effect)
    if not scoped(run) or run.get(RUNNING.done):
        return []
    names: list[str] = []
    for one in [*(commands or []), run, *(run.get(RUNNING.steps) or [])]:
        if one.get(COMMAND.effect) != effect:
            continue
        name = shown(one)
        if name and (not names or names[-1] != name):
            names.append(name)
    return [{"value": names[-MOST_STEPS:], "duration": ROLL_EVERY, "color": MUTED, "align": RIGHT}] if len(names) > 1 else []


def outcome(result: dict) -> list[dict]:
    failed = result.get("failed")
    return [{"value": f"{failed} failed", "color": RED} if failed else {"value": "passed", "color": GREEN}]


def inner(run: dict) -> dict:
    step = run.get(RUNNING.step) or ""
    if not step or run.get(RUNNING.done) or scoped(run):
        return {}
    return {RUNNING.what: step, RUNNING.tool: "Bash", RUNNING.effect: run.get(RUNNING.step_effect) or ""}


def words_for(run: dict, flips: list) -> list[dict]:
    said = named(run)
    if not said:
        return gisted(run)
    noun = NOUNS.get(run.get(RUNNING.effect) or "")
    return [*said, *flips] if flips else [*said, *([{"value": noun, "color": MUTED}] if noun else [])]


def line(run: dict, commands: list | None = None, now: float = 0.0) -> dict:
    if not run or not run.get(RUNNING.what):
        return {}
    step = inner(run)
    said = words_for(step, []) if step else words_for(run, flipping(run, commands or []))
    if not said:
        return {}
    done = float(run.get(RUNNING.done) or 0)
    result = run.get(RUNNING.result) or {}
    return {
        "key": key_of(said),
        "parts": [*said, *(outcome(result) if done and result else [])],
        "at": run.get(RUNNING.at) or 0,
        "done": bool(done),
        "clock": (done or now or 0) - float(run.get(RUNNING.at) or 0) >= CLOCK_AFTER,
        "hold": HOLD if run.get(RUNNING.effect) in HELD else 0.0,
    }


def key_of(parts: list[dict]) -> str:
    return " ".join(p["value"] if isinstance(p["value"], str) else (p["value"][0] if p["value"] else "") for p in parts)


def said_once(run: dict) -> dict:
    said = words_for(run, [])
    return {"at": run.get(RUNNING.at) or 0, "key": key_of(said), "parts": said} if said else {}


def bar(row, now: float = 0.0) -> dict:
    return {"line": line(row.running, row.commands, now), "commands": [c for c in (said_once(one) for one in row.commands or []) if c]}


class StatusLine(Feature):
    name = "statusline"
    title_ = "What the status bar shows"
    abstract_ = "The journal says what the bar shows, what it flips through and how long it lingers; the viewer renders it"
    help_ = "A command worth naming as one act keeps its line and the bar flips through the files it is working on, every half second. Editing, deleting and a test run hold their line a second when something else replaces them, so their counts and their outcome can be read."
