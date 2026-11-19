from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.watch import Watch


@dataclass(frozen=True)
class RecordGivenPercent(Command[Watch]):
    """Notes the percent of the run the watch last told the agent of."""

    lock = True

    watch_id: int
    given_percent: int
