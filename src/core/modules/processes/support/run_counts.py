from core.modules.agents.models.agent import Agent
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from engine.command.context import Context
from core.modules.processes.models.process_part import ProcessPart


class RunCounts:
    """A suite's optional command listings that count a run before it starts, and the suite's say on what a
    missing or poor reader must be asked for."""

    def count_missing(self, process: Process, part: ProcessPart) -> bool:
        return False

    def exceeds_counts(self) -> bool:
        return True

    def line(self, process: Process) -> str:
        return ""

    def has_listing(self, process: Process, agent: Agent, output: Output | None) -> bool:
        return False

    def count(self, process: Process, text: str) -> int:
        return 0

    def reject_unknown(self, process: Process, agent: Agent, status: int | None, count: int, context: Context) -> None:
        pass
