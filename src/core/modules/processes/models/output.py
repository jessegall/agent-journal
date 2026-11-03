from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.lifecycles.output_lifecycle import OutputLifecycle


@dataclass(frozen=True, kw_only=True)
class Output(Model):
    """What a process printed, kept in its folder under .journal/processes/<id>/ until pruned: its size in
    bytes and lines, when the agent last read it, and the position of the part its reader reads, 0 for all."""

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
    state: OutputState = OutputState.KEPT
    ended_at: Timestamp | None = None
    read_at: Timestamp | None = None
    pruned_at: Timestamp | None = None

    def prune(self, timestamp: Timestamp, actor: Actor) -> "Output":
        return self.moved(OutputLifecycle.prune, pruned_at=timestamp)
