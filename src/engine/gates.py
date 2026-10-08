from dataclasses import asdict, dataclass
from enum import StrEnum
from pathlib import Path

from engine import runtime
from resources.fields import Loaded
from engine.reach import Reach
from engine.extension import Extension

POLICIES = Extension()
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


@dataclass(frozen=True)
class Hold(Loaded):
    why: str = ""
    reach: Reach = Reach.MAIN


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
    gate = record.state_at(gate_file(record.root, record.env, session))
    if gate.get(key) == (asdict(given) if given.why else None):
        return
    with gate.changing() as holds:
        holds.pop(key, None)
        if given.why:
            holds[key] = asdict(given)


def held(record, session: str, subagent: bool = False) -> str:
    holds = (Hold.from_json(raw) for raw in record.state_at(gate_file(record.root, record.env, session)).all().values())
    return "; ".join(one.why for one in holds if one.why and one.reach.reaches(subagent))
