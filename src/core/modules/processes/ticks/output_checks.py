from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.processes.commands.check_output.check_output import CheckOutput
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.watch_query import WatchQuery
from core.modules.processes.support.output_check_schedule import OutputCheckSchedule


class OutputChecks:
    """Wakes the agents whose wait on a running output has reached its next check."""

    def __call__(self, container: Container) -> bool:
        timestamp = container.get(Clock).timestamp()
        schedule = container.get(OutputCheckSchedule)
        running = {process.id: process for process in container.get(ProcessQuery).running().all_rows()}
        due = [watch for watch in container.get(WatchQuery).filter(state=WatchState.OPEN).all_rows() if watch.process_id in running and schedule.is_due(watch, timestamp)]
        for watch in due:
            container.get(Bus).run(CheckOutput(watch.id), Actor.core(), environment_id=running[watch.process_id].environment_id)
        return bool(due)
