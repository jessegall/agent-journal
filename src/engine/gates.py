from dataclasses import asdict, dataclass
from enum import StrEnum
from pathlib import Path

from engine import runtime
from resources.fields import Loaded
from engine.reach import Reach
from engine.extension import Extension

POLICIES = Extension()
STILL_HELD: dict = {}
AFTERWARDS = Extension()
CANCELERS = Extension()
RESPONDERS = Extension()
DISPATCHING, LONG_COMMAND = "agent.dispatching", "agent.command.long"
CANCELABLE = (DISPATCHING, LONG_COMMAND)


class Runs(StrEnum):
    """Whether a hook part runs before the hook answers, because it decides the tool call, or after it, because it only tells the agent."""

    SYNC = "sync"
    ASYNC = "async"

    def policies(self) -> Extension:
        return {Runs.SYNC: POLICIES, Runs.ASYNC: AFTERWARDS}[self]


@dataclass(frozen=True)
class HookCall:
    provider: object
    record: object
    hook: object
    row: object

    @property
    def session(self) -> str:
        return self.row.title

    @property
    def subagent(self) -> bool:
        return self.row.subagent if self.hook is None else self.provider.is_subagent(self.hook)


class Stops(StrEnum):
    """How far a hold reaches into the agent's work: one on writes lets it read and search while it decides, one on everything stops the next tool call of any kind."""

    WRITES = "writes"
    EVERYTHING = "everything"

    def stops(self, writing: bool) -> bool:
        return self is Stops.EVERYTHING or writing


@dataclass(frozen=True)
class Hold(Loaded):
    why: str = ""
    reach: Reach = Reach.MAIN
    scope: Stops = Stops.WRITES


def cancelled(name: str, call: HookCall, data: dict) -> str:
    reasons = [reason for cancel in CANCELERS.each(key=name) if cancel.guard.reaches(call.subagent) and (reason := cancel(call, data))]
    return "; ".join(reasons)


def responded(call: HookCall) -> str:
    return "".join(respond(call) for respond in RESPONDERS.each(key=call.hook.event))


def start_file(root: Path, env: str, compacted: bool = False) -> Path:
    return runtime.folder(root) / f"{'compact' if compacted else 'start'}-{env}.md"


def gate_file(root: Path, env: str, session: str) -> Path:
    return runtime.session_file(root, session, f"gate-{env}.json")


def hold(record, session: str, key: str, given: Hold) -> None:
    path = gate_file(record.root, record.env, session)
    if not given.why and not path.is_file():
        return
    gate = record.state_at(path)
    if gate.get(key) == (asdict(given) if given.why else None):
        return
    with gate.changing() as holds:
        holds.pop(key, None)
        if given.why:
            holds[key] = asdict(given)


def holds(record, session: str, subagent: bool = False) -> list[Hold]:
    """Every hold standing against the session: each one in its gate file whose feature still stands by it, since a hold the feature has not released is no reason to refuse anything."""
    gate = record.state_at(gate_file(record.root, record.env, session))
    standing = []
    for key, raw in gate.all().items():
        one = Hold.from_json(raw)
        if one.why and key in STILL_HELD and not STILL_HELD[key](record, session):
            with gate.changing() as kept:
                kept.pop(key, None)
            continue
        standing.append(one)
    return [one for one in standing if one.why and one.reach.reaches(subagent)]


def held(record, session: str, subagent: bool = False, writing: bool = True) -> str:
    """Why the session's next tool call is refused: every standing hold that reaches this agent and stops a call of this kind."""
    return "; ".join(one.why for one in holds(record, session, subagent) if one.scope.stops(writing))
