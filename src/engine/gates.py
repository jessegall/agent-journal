from pathlib import Path

from engine import runtime

POLICIES: list = []
AFTERWARDS: list = []
CANCELERS: dict[str, list] = {}
DISPATCHING, LONG_COMMAND = "agent.dispatching", "agent.command.long"
CANCELABLE = (DISPATCHING, LONG_COMMAND)


def cancelled(name: str, provider, record, hook, session: str, data: dict) -> str:
    reasons = [reason for cancel in CANCELERS.get(name, []) if (reason := cancel(provider, record, hook, session, data))]
    return "; ".join(reasons)


def start_file(root: Path, env: str, compacted: bool = False) -> Path:
    return root / "runtime" / f"{'compact' if compacted else 'start'}-{env}.md"


def gate_file(root: Path, env: str, session: str) -> Path:
    return runtime.session_file(root, session, f"gate-{env}.json")
