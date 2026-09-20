from features.base import Feature
from features.statusline.gist import gist, gist_tokens
from features.statusline.spoken import spoken
from resources.types import COMMAND, RUNNING

HELD = ("writes", "deletes", "tests")
SCOPED = (*HELD, "installs", "builds", "reads")
VERBS = {"tests": "running", "deletes": "deleting", "writes": "editing", "reads": "reading",
         "installs": "installing", "builds": "building"}
NOUNS = {"tests": "tests", "deletes": "files", "writes": "files", "reads": "files", "installs": "dependencies"}
ROLL_EVERY = 0.5
HOLD = 1.0
CLOCK_AFTER = 10.0
MOST_STEPS = 12
NAME_CAP = 42


def scoped(run: dict) -> bool:
    return run.get(RUNNING.effect) in SCOPED


def own_words(run: dict) -> bool:
    return bool(run.get(RUNNING.tool)) and run.get(RUNNING.tool) != "Bash"


def gisted(run: dict) -> list[dict]:
    what = run.get(RUNNING.what) or ""
    return gist_tokens(what if own_words(run) else gist(what, spoken))


def named(run: dict) -> list[dict]:
    verb = VERBS.get(run.get(RUNNING.effect) or "")
    return [{"value": verb, "kind": "command"}] if verb else []


def shown(what: str) -> str:
    what = (what or "").strip()
    return what if len(what) <= NAME_CAP else (what.rsplit("/", 1)[-1] or what)[-NAME_CAP:]


def flipping(run: dict, commands: list) -> dict:
    effect = run.get(RUNNING.effect)
    if not scoped(run) or run.get(RUNNING.done):
        return {}
    names: list[str] = []
    for one in [*(commands or []), run, *(run.get(RUNNING.steps) or [])]:
        if one.get(COMMAND.effect) != effect:
            continue
        name = shown(one.get(COMMAND.what))
        if name and (not names or names[-1] != name):
            names.append(name)
    return {"every": ROLL_EVERY, "items": names[-MOST_STEPS:]} if len(names) > 1 else {}


def outcome(result: dict) -> list[dict]:
    failed = result.get("failed")
    return [{"value": f"{failed} failed", "kind": "failed"} if failed else {"value": "passed", "kind": "passed"}]


def inner(run: dict) -> dict:
    step = run.get(RUNNING.step) or ""
    if not step or run.get(RUNNING.done) or scoped(run):
        return {}
    return {RUNNING.what: step, RUNNING.tool: "Bash", RUNNING.effect: run.get(RUNNING.step_effect) or ""}


def words_for(run: dict, roll: dict) -> list[dict]:
    said = named(run)
    if not said:
        return gisted(run)
    noun = NOUNS.get(run.get(RUNNING.effect) or "")
    return said if roll.get("items") else [*said, *([{"value": noun, "kind": "argument"}] if noun else [])]


def line(run: dict, commands: list | None = None, now: float = 0.0) -> dict:
    if not run or not run.get(RUNNING.what):
        return {}
    step = inner(run)
    roll = flipping(run, commands or [])
    said = words_for(step, {}) if step else words_for(run, roll)
    if not said:
        return {}
    done = float(run.get(RUNNING.done) or 0)
    result = run.get(RUNNING.result) or {}
    return {
        "key": " ".join(t["value"] for t in said),
        "tokens": [*said, *(outcome(result) if done and result else [])],
        "roll": {} if step else roll,
        "at": run.get(RUNNING.at) or 0,
        "done": bool(done),
        "clock": (done or now or 0) - float(run.get(RUNNING.at) or 0) >= CLOCK_AFTER,
        "hold": HOLD if run.get(RUNNING.effect) in HELD else 0.0,
    }


def said_once(run: dict) -> dict:
    said = words_for(run, {})
    return {"at": run.get(RUNNING.at) or 0, "key": " ".join(t["value"] for t in said), "tokens": said} if said else {}


def bar(row, now: float = 0.0) -> dict:
    return {"line": line(row.running, row.commands, now), "commands": [c for c in (said_once(one) for one in row.commands or []) if c]}


class StatusLine(Feature):
    name = "statusline"
    title_ = "What the status bar shows"
    abstract_ = "The journal says what the bar shows, what it flips through and how long it lingers; the viewer renders it"
    help_ = "A command worth naming as one act keeps its line and the bar flips through the files it is working on, every half second. Editing, deleting and a test run hold their line a second when something else replaces them, so their counts and their outcome can be read."
