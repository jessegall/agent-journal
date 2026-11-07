from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.watch import Watch


@dataclass(frozen=True)
class RecordGivenPercent(Command[Watch]):
    """Notes the percent of the run the watch last told the agent of."""

    watch_id: int
    given_percent: int
