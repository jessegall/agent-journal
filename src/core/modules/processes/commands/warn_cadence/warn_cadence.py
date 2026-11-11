from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class WarnCadence(Command[Process]):
    """Tells the agent that started a run how the run's part prints: nothing yet, nothing for a while, or too
    seldom, after the given seconds."""

    process_id: int
    part_position: int
    kind: NoticeKind
    seconds: int
