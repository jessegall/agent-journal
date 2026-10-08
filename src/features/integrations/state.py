from dataclasses import asdict, dataclass, replace
from pathlib import Path

from engine.fields import Loaded
from engine.stored import read_json, write_json
from features.secrets.running import Masker
from features.secrets.values import ValuesFile

FOLDER = "integration-data"


@dataclass(frozen=True)
class IntegrationState(Loaded):
    """What an integration learned on its last runs: kept beside the record, never in it, and written only by the journal."""

    last_checked: float = 0.0
    last_error: str = ""
    cursor: str = ""
    paused_until: float = 0.0
    failures: int = 0


def state_file(root: Path, name: str) -> Path:
    return Path(root) / FOLDER / name / "state.json"


def read_state(root: Path, name: str) -> IntegrationState:
    return read_json(state_file(root, name), IntegrationState.from_json, IntegrationState())


def write_state(root: Path, name: str, state: IntegrationState) -> None:
    """The one place state is written, so no writer can store a secret's value in the error."""
    masker = Masker({value: variable for variable, value in ValuesFile(root).values().items() if value})
    state = replace(state, last_error=masker.masked(state.last_error.encode()).decode(errors="replace"))
    path = state_file(root, name)
    path.parent.mkdir(parents=True, exist_ok=True)
    write_json(path, asdict(state))
