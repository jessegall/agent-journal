from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.processes.models.enums.reader_type import ReaderType


@dataclass(frozen=True, kw_only=True)
class Reader(Model):
    """A named way to read outputs of one shape: by a pattern of lines or by a script the output is handed to,
    with the commands it reads, how it sees progress, a finish, a failure and a summary, its card's title,
    and the plugin it came with, if any."""

    shared_rows = True

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
    subject: str = ""
    step_pattern: str = ""
    count_pattern: str = ""
    count_command: str = ""
    proved_on: int | None = None
    is_default: bool = False
    plugin_name: str = ""

    def has_counted_steps(self) -> bool:
        return bool(self.step_pattern and self.count_pattern)
