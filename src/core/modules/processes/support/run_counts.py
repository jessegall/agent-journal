from core.modules.agents.models.agent import Agent
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.base.command.context import Context
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.reader import Reader


class RunCounts:
    """A suite's optional command listings that count a run before it starts, and the suite's say on what a
    missing or poor reader must be asked for."""

    def reader_reason(self, process: Process, spec: PartSpec, reader: Reader | None, reason: str) -> str:
        return reason

    def line(self, process: Process) -> str:
        return ""

    def has_listing(self, process: Process, agent: Agent, output: Output | None) -> bool:
        return False

    def count(self, process: Process, text: str) -> int:
        return 0

    def reject_unknown(self, process: Process, agent: Agent, status: int | None, count: int, context: Context) -> None:
        pass
