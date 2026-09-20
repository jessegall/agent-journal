from features.base import Feature
from resources.types import RUNNING

CHANGING = ("writes", "deletes")
SCOPED = (*CHANGING, "tests", "installs", "builds", "reads")
WORDS = {
    "tests": (("running", "command"), ("tests", "argument")),
    "deletes": (("deleting", "command"), ("files", "argument")),
    "writes": (("editing", "command"), ("files", "argument")),
    "reads": (("reading", "command"), ("files", "argument")),
    "installs": (("installing", "command"), ("dependencies", "argument")),
    "builds": (("building", "command"),),
}
ROLL_EVERY = 0.5
HOLD = 1.0
CLOCK_AFTER = 10.0
MOST_STEPS = 12


def tokens(effect: str) -> list[dict]:
    return [{"value": value, "kind": kind} for value, kind in WORDS.get(effect, ())]


def scoped(run: dict) -> bool:
    return run.get(RUNNING.effect) in SCOPED


def changing(run: dict) -> bool:
    return run.get(RUNNING.effect) in CHANGING


def outcome(result: dict) -> list[dict]:
    failed = result.get("failed")
    return [{"value": f"{failed} failed", "kind": "failed"} if failed else {"value": "passed", "kind": "passed"}]


def rolling(run: dict) -> dict:
    steps = [step for step in (run.get(RUNNING.steps) or []) if step]
    return {"every": ROLL_EVERY, "items": steps[-MOST_STEPS:]} if scoped(run) and not run.get(RUNNING.done) and len(steps) > 1 else {}


def line(run: dict, now: float = 0.0) -> dict:
    if not run or not run.get(RUNNING.what):
        return {}
    effect = run.get(RUNNING.effect) or ""
    said = tokens(effect)
    if not said:
        return {}
    done = float(run.get(RUNNING.done) or 0)
    result = run.get(RUNNING.result) or {}
    return {
        "key": " ".join(t["value"] for t in said),
        "tokens": [*said, *(outcome(result) if done and result else [])],
        "roll": rolling(run),
        "at": run.get(RUNNING.at) or 0,
        "done": bool(done),
        "clock": (done or now or 0) - float(run.get(RUNNING.at) or 0) >= CLOCK_AFTER,
        "hold": HOLD if changing(run) else 0.0,
    }


class StatusLine(Feature):
    name = "statusline"
    title_ = "What the status bar shows"
    abstract_ = "The journal says what the bar shows, what it flips through and how long it lingers; the viewer renders it"
    help_ = "A command worth naming as one act keeps its line while its inner steps run, and the bar flips through those steps every half second. Editing and deleting hold their line a second when something else replaces them, so their line counts can be read."
