from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class ReaderRequest(EnvironmentScoped, Model):
    """A command waiting for a proper reader."""

    model_name = "reader_request"
    cli_name = "reader-request"

    environment_id: int = 0
    creator_id: int
    command_key: str
    command: str
    category: CommandCategory
    reason: str
    expires_at: Timestamp
    sample_process_id: int | None = None
    reader_id: int | None = None
    skip_reason: str = ""
    completed_at: Timestamp | None = None
