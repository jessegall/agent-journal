from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.base.module.performance_tools import PerformanceTools
from engine.repository.stale_row_error import StaleRowError
from engine.scope.scopes import Scopes
from core.base.database.points import Points
from core.modules.developer.support.slow_tick_tool import SlowTickTool, TICK_LIMIT_POINTS
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.models.process import Process
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.grown_outputs import GrownOutputs
from core.modules.processes.support.prepared_read import PreparedRead
from core.modules.processes.support.reader_step import ReaderStep

WARNING_REPEAT_TICKS = 5


class OutputReading:
    """Every second each running output that grew goes through its reader, which writes its lines to their
    file and what it found on the output row; repeated costly reads are reported every fifth tick."""

    def __init__(self) -> None:
        self.last_warned_points = 0
        self.ticks_since_warning = 0

    def __call__(self, container: Container) -> bool:
        tools = container.get(PerformanceTools)
        started = tools.begin()
        has_read = self.read(container)
        cost = tools.cost(started)
        if cost is not None:
            self.warn_if_slow(container, cost)
        return has_read

    def read(self, container: Container) -> bool:
        new_output = container.get(GrownOutputs)
        processes = tuple(container.get(ProcessQuery).running().oldest().all_rows())
        outputs = container.get(OutputQuery).process_outputs(tuple(process.id for process in processes)) if processes else ()
        process_outputs = {output.process_id: output for output in outputs}
        updated = [(process, process_outputs[process.id]) for process in processes if process.id in process_outputs and new_output.has_new_output(process_outputs[process.id])]
        for process, output in updated:
            self.read_run(container, process, output)
        return bool(updated)

    @staticmethod
    def read_run(container: Container, process: Process, output: Output) -> None:
        with container.get(Scopes).opened(None, process.environment_id):
            advance = container.get(ReaderStep).advance(process, output, False)
        if advance is not None:
            try:
                container.get(Bus).run(ReadNewOutput(process.id, prepared=PreparedRead(output, advance)), Actor.core(), environment_id=process.environment_id)
            except StaleRowError:
                container.get(Bus).run(ReadNewOutput(process.id), Actor.core(), environment_id=process.environment_id)

    def warn_if_slow(self, container: Container, cost: Points) -> None:
        points = cost.total
        if points <= TICK_LIMIT_POINTS:
            self.last_warned_points = 0
            self.ticks_since_warning = 0
            return
        self.ticks_since_warning += 1
        if points <= self.last_warned_points and self.ticks_since_warning < WARNING_REPEAT_TICKS:
            return
        if container.get(PerformanceTools).run(SlowTickTool, points, cost.line()):
            self.last_warned_points = points
            self.ticks_since_warning = 0
