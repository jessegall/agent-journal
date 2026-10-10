import time
import uuid
from dataclasses import asdict, dataclass
from pathlib import Path
from engine import runtime
from engine.stored import read_json, write_json
from resources.fields import Loaded

STALE = 600.0
STALE_FOR = {"background": 15.0}
FORCE = "force"
PERMIT = "permit"
BACKGROUND = "background"
SHELL = "shell"
PAUSE = "pause"
RESUME = "resume"
UPDATE = "the update"
KEYS = (FORCE, PERMIT, BACKGROUND, PAUSE, RESUME)


@dataclass(frozen=True)
class Input(Loaded):
    session: str = ""
    keys: tuple = ()
    label: str = ""
    at: float = 0.0
    action: str = ""
    provider: str = ""
    value: str = ""

    @property
    def lasting(self) -> bool:
        return bool(self.action) and self.action not in KEYS

    @property
    def for_viewer(self) -> dict:
        return {**{key: value for key, value in asdict(self).items() if key != "keys"}, "queued": True}


@dataclass(frozen=True)
class QueuedCommand(Loaded):
    at: float = 0.0
    command: str = ""
    typed: float = 0.0


def waiting_commands(row) -> list[QueuedCommand]:
    return [QueuedCommand.from_json(given) for given in row.queued_commands if isinstance(given, dict)] if row else []


def queue(root: Path, session: str, keys: tuple, label: str, action: str = "", provider: str = "", value: str = "") -> Input:
    queued = Input(session, tuple(keys), label, time.time(), action, provider, value)
    folder = runtime.inputs(root)
    folder.mkdir(parents=True, exist_ok=True)
    if queued.lasting:
        for path in folder.glob("*.json"):
            older = read_json(path, Input.from_json, None)
            if older is not None and older.session == session and older.action == action:
                path.unlink(missing_ok=True)
    return filed(root, queued)


def filed(root: Path, queued: Input) -> Input:
    folder = runtime.inputs(root)
    folder.mkdir(parents=True, exist_ok=True)
    write_json(folder / f"{time.time_ns()}-{uuid.uuid4().hex}.json", asdict(queued))
    return queued


def withdraw(root: Path, session: str, action: str, value: str = "") -> None:
    """Takes back the inputs of one kind still waiting for a session, so a pause that never reached the agent cannot land after its resume."""
    for path in runtime.inputs(root).glob("*.json"):
        waiting = read_json(path, Input.from_json, None)
        if waiting is not None and (waiting.session, waiting.action, waiting.value) == (session, action, value):
            path.unlink(missing_ok=True)


def take(root: Path, sessions: set[str], action: str = "", among: tuple = ()) -> Input | None:
    folder = runtime.inputs(root)
    for path in sorted(folder.glob("*.json")):
        queued = read_json(path, Input.from_json, None)
        if queued is None:
            path.unlink(missing_ok=True)
            continue
        if not queued.lasting and time.time() - queued.at > STALE_FOR.get(queued.action, STALE):
            path.unlink(missing_ok=True)
            continue
        if queued.session not in sessions or not wanted(queued, action, among):
            continue
        path.unlink(missing_ok=True)
        return queued
    return None


def wanted(queued: Input, action: str, among: tuple) -> bool:
    return queued.action in among if among else pressed(queued.action) == pressed(action)


def pressed(action) -> str:
    return action if action in (*KEYS, SHELL) else ""
