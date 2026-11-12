from dataclasses import dataclass

from engine.enums.process_kind import ProcessKind
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class RequestRun(EnvironmentScoped, Model):
    """One hook, journal command, viewer request or run of the journal's own that went through the one door: the
    agent it worked for, its kind, its words without any value, and how it ended. Written once, when it ended."""

    model_name = "request_run"
    events_expire = True
    cli_name = "request-run"

    environment_id: int = 0
    session_agent_id: int
    creator_id: int
    kind: ProcessKind
    line: str
    exit_code: int
    ended_at: Timestamp
