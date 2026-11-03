import time
from collections.abc import Callable

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.performance.performance_tools import PerformanceTools
from core.base.timestamp import Timestamp
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.grown_outputs import GrownOutputs

WARNING_PERIOD_SECONDS = 60


class OutputReading:
    """Every second each running output that grew goes through its reader, which writes its lines to their file and
    what it found on the output row; it answers True then, so the listeners wake. Reading too slowly goes to the
    slow tick tool, at most once a minute."""

    def __init__(self, seconds: Callable[[], float] = time.monotonic) -> None:
        self.seconds = seconds
        self.warned_at: Timestamp | None = None

    def __call__(self, container: Container) -> bool:
        started = self.seconds()
        has_read = self.read(container)
        self.warn_if_slow(container, self.seconds() - started)
        return has_read

    def read(self, container: Container) -> bool:
        bus, grown = container.get(Bus), container.get(GrownOutputs)
        grown_runs = [process for process in tuple(container.get(ProcessQuery).running().oldest().all_rows()) if grown.has_new_bytes(process.id)]
        for process in grown_runs:
            bus.run(ReadNewOutput(process.id), Actor.core(), environment_id=process.environment_id)
        return bool(grown_runs)

    def warn_if_slow(self, container: Container, tick_seconds: float) -> None:
        clock_time = container.get(Clock).timestamp()
        recently_warned = self.warned_at is not None and self.warned_at.elapsed_seconds(clock_time) < WARNING_PERIOD_SECONDS
        if not recently_warned and container.get(PerformanceTools).run(SlowTickTool, tick_seconds):
            self.warned_at = clock_time
