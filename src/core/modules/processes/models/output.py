from dataclasses import dataclass

from core.base.model.model import END_CHANGE, Model
from core.base.timestamp import Timestamp
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.lifecycles.output_lifecycle import OutputLifecycle


@dataclass(frozen=True, kw_only=True)
class Output(Model):
    """A process's stored output, reader results and reading progress."""

    change_names = tuple([END_CHANGE])

    model_name = "output"
    cli_name = "output"
    lifecycle = OutputLifecycle

    process_id: int
    creator_id: int
    folder: str
    byte_count: int = 0
    line_count: int = 0
    reader_id: int | None = None
    reader_position: int = 0
    read_offset: int = 0
    read_lines: int = 0
    reader_lines: int = 0
    reader_summary: str = ""
    title: str = ""
    steps_passed: int = 0
    steps_failed: int = 0
    progress: int = 0
    test_count: int = 0
    state: OutputState = OutputState.KEPT
    ended_at: Timestamp | None = None
    read_at: Timestamp | None = None
    pruned_at: Timestamp | None = None

