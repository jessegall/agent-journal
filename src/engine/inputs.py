import time
import uuid
from dataclasses import asdict, dataclass
from pathlib import Path
from engine.stored import read_json, write_json
from engine.fields import Loaded

STALE = 600.0
FORCE = "force"
PERMIT = "permit"
BACKGROUND = "background"
SHELL = "shell"
PAUSE = "pause"
RESUME = "resume"
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
    folder = Path(root) / "runtime" / "inputs"
    folder.mkdir(parents=True, exist_ok=True)
    if queued.lasting:
        for path in folder.glob("*.json"):
            older = read_json(path)
            if isinstance(older, dict) and Input.from_json(older).session == session and Input.from_json(older).action == action:
                path.unlink(missing_ok=True)
    target = folder / f"{time.time_ns()}-{uuid.uuid4().hex}.json"
    write_json(target, asdict(queued))
    return queued


def take(root: Path, sessions: set[str], action: str = "") -> Input | None:
    folder = Path(root) / "runtime" / "inputs"
    for path in sorted(folder.glob("*.json")):
        raw = read_json(path)
        if not isinstance(raw, dict):
            path.unlink(missing_ok=True)
            continue
        queued = Input.from_json(raw)
        if not queued.lasting and time.time() - queued.at > STALE:
            path.unlink(missing_ok=True)
            continue
        if queued.session not in sessions or pressed(queued.action) != pressed(action):
            continue
        path.unlink(missing_ok=True)
        return queued
    return None


def pressed(action) -> str:
    return action if action in (*KEYS, SHELL) else ""
