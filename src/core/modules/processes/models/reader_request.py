from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class ReaderRequest(Model):
    """A command waiting for a proper reader."""

    model_name = "reader_request"
    cli_name = "reader-request"

    environment_id: int
    creator_id: int
    command_key: str
    command: str
    category: CommandCategory
    reason: str
    hold_until: Timestamp
    sample_process_id: int | None = None
    reader_id: int | None = None
    waive_reason: str = ""
    settled_at: Timestamp | None = None
