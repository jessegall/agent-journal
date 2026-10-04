from dataclasses import asdict, dataclass
from pathlib import Path

from engine import runtime
from engine.fields import Loaded
from engine.reach import Reach
from engine.stored import read_json, write_json

POLICIES: list = []
AFTERWARDS: list = []
CANCELERS: dict[str, list] = {}
RESPONDERS: dict[str, list] = {}
DISPATCHING, LONG_COMMAND = "agent.dispatching", "agent.command.long"
CANCELABLE = (DISPATCHING, LONG_COMMAND)


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
    reasons = [reason for cancel in CANCELERS.get(name, []) if cancel.guard.reaches(call.subagent) and (reason := cancel(call, data))]
    return "; ".join(reasons)


def responded(call: HookCall) -> str:
    return "".join(respond(call) for respond in RESPONDERS.get(call.hook.event, []))


def start_file(root: Path, env: str, compacted: bool = False) -> Path:
    return runtime.folder(root) / f"{'compact' if compacted else 'start'}-{env}.md"


def gate_file(root: Path, env: str, session: str) -> Path:
    return runtime.session_file(root, session, f"gate-{env}.json")


def hold(root: Path, env: str, session: str, key: str, given: Hold) -> None:
    f = gate_file(root, env, session)
    holds = read_json(f, dict, {})
    kept = {k: v for k, v in holds.items() if k != key}
    changed = {**kept, key: asdict(given)} if given.why else kept
    if changed != holds:
        write_json(f, changed)


def held(record, session: str, subagent: bool = False) -> str:
    holds = (Hold.from_json(raw) for raw in read_json(gate_file(record.root, record.env, session), dict, {}).values())
    return "; ".join(one.why for one in holds if one.why and one.reach.reaches(subagent))
