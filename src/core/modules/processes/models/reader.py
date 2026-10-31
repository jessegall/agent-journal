from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.processes.models.enums.reader_type import ReaderType


@dataclass(frozen=True, kw_only=True)
class Reader(Model):
    """A named way to read outputs of one shape: by a pattern of lines or by a script the output is handed to,
    with the commands it reads, how it sees progress, a finish, a failure and a summary, and its card's
    title."""

    model_name = "reader"
    cli_name = "reader"

    environment_id: int | None = None
    creator_id: int
    name: str
    type: ReaderType
    commands: str
    lines_pattern: str = ""
    script: str = ""
    progress_pattern: str = ""
    finished_pattern: str = ""
    failed_pattern: str = ""
    summary_pattern: str = ""
    topic_pattern: str = ""
    title: str = ""
    is_default: bool = False
