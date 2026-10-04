from dataclasses import asdict, dataclass
from pathlib import Path

from engine import runtime
from engine.fields import Loaded
from engine.reach import Reach
from engine.stored import read_json, write_json

POLICIES: list = []
AFTERWARDS: list = []
CANCELERS: dict[str, list] = {}
DISPATCHING, LONG_COMMAND = "agent.dispatching", "agent.command.long"
CANCELABLE = (DISPATCHING, LONG_COMMAND)


@dataclass(frozen=True)
class Hold(Loaded):
    why: str = ""
    reach: Reach = Reach.MAIN


def cancelled(name: str, provider, record, hook, session: str, data: dict, subagent: bool) -> str:
    reasons = [reason for cancel in CANCELERS.get(name, []) if cancel.guard.reaches(subagent) and (reason := cancel(provider, record, hook, session, data))]
    return "; ".join(reasons)


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
