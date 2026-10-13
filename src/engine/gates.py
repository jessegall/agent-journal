from dataclasses import asdict, dataclass
from pathlib import Path

from engine import runtime
from declaring.holds import Hold, Stops

from declaring.registries import STILL_HELD  # noqa: F401
"""Whether a feature still stands by a hold, by the key of the hold or the key every hold of a kind starts with before its own number."""
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


def start_file(root: Path, env: str, compacted: bool = False) -> Path:
    return Path(root) / start_name(env, compacted)


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
        still = next((check for stands, check in STILL_HELD.items() if key == stands or key.startswith(f"{stands}.")), None)
        if one.why and still and not still(record, session):
            with gate.changing() as kept:
                kept.pop(key, None)
            continue
        standing.append(one)
    return [one for one in standing if one.why and one.reach.reaches(subagent)]


def held(record, session: str, subagent: bool = False, writing: bool = True) -> str:
    """Why the session's next tool call is refused: every standing hold that reaches this agent and stops a call of this kind."""
    return "; ".join(one.why for one in holds(record, session, subagent) if one.scope.stops(writing))
