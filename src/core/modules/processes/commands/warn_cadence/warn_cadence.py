from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class WarnCadence(Command[Process]):
    """Tells the agent that started a run how the run's part prints: nothing yet, nothing for a while, too
    seldom, or nothing with its processor time still, after the given seconds; the limit is when an idle run is
    stopped."""

    process_id: int
    part_position: int
    kind: NoticeKind
    seconds: int
    limit: int
