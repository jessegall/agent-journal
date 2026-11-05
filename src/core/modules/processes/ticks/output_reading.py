from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.module.performance_tools import PerformanceTools
from core.base.scope.scopes import Scopes
from core.base.timestamp import Timestamp
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.grown_outputs import GrownOutputs
from core.modules.processes.support.prepared_read import PreparedRead
from core.modules.processes.support.reader_step import ReaderStep

WARNING_PERIOD_SECONDS = 60


class OutputReading:
    """Every second each running output that grew goes through its reader, which writes its lines to their
    file and what it found on the output row; costly reads are reported at most once a minute."""

    def __init__(self) -> None:
        self.warned_at: Timestamp | None = None

    def __call__(self, container: Container) -> bool:
        tools = container.get(PerformanceTools)
        started = tools.begin()
        has_read = self.read(container)
        cost = tools.cost(started)
        if cost is not None:
            self.warn_if_slow(container, cost.total)
        return has_read

    def read(self, container: Container) -> bool:
        grown = container.get(GrownOutputs)
        grown_runs = [process for process in tuple(container.get(ProcessQuery).running().oldest().all_rows()) if grown.has_new_bytes(process.id)]
        for process in grown_runs:
            self.read_run(container, process)
        return bool(grown_runs)

    @staticmethod
    def read_run(container: Container, process: Process) -> None:
        output = container.get(OutputQuery).process_output(process.id)
        if output is None:
            return
        with container.get(Scopes).opened(None, process.environment_id):
            advance = container.get(ReaderStep).advance(process, output, False)
        if advance is not None:
            container.get(Bus).run(ReadNewOutput(process.id, prepared=PreparedRead(output, advance)), Actor.core(), environment_id=process.environment_id)

    def warn_if_slow(self, container: Container, points: int) -> None:
        clock_time = container.get(Clock).timestamp()
        recently_warned = self.warned_at is not None and self.warned_at.elapsed_seconds(clock_time) < WARNING_PERIOD_SECONDS
        if not recently_warned and container.get(PerformanceTools).run(SlowTickTool, points):
            self.warned_at = clock_time
