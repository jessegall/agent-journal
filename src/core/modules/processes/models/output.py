from dataclasses import dataclass

from engine.model.model import END_CHANGE, Model
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.lifecycles.output_lifecycle import OutputLifecycle


@dataclass(frozen=True, kw_only=True)
class Output(Model):
    """A process's stored output, reader results and reading progress."""

    change_names = tuple([END_CHANGE])

    model_name = "output"
    events_expire = True
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
    displayed_offset: int = 0
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
    fully_read_at: Timestamp | None = None
    full_read_output_id: int | None = None
    pruned_at: Timestamp | None = None

    def has_new_full_read(self, previous: "Output | None") -> bool:
        return self.fully_read_at is not None and (previous is None or previous.fully_read_at != self.fully_read_at)

    def change_name(self, old_row: Model | None) -> str | None:
        newly_ended = self.ended_at is not None and (not isinstance(old_row, Output) or old_row.ended_at is None)
        return END_CHANGE if newly_ended else None
