from collections.abc import Callable

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.grown_outputs import GrownOutputs
from server.round_work import RoundWork


class OutputReadWork(RoundWork):
    """The output read round, every few seconds: a running output that grew goes through its reader, so a run's
    row and mark show its progress as it happens and not only at the minute's tick. A read wakes the listeners,
    which keep the run's chat mark up to date."""

    def __init__(self, wake_listeners: Callable[[], None]) -> None:
        self.wake_listeners = wake_listeners

    def run(self, container: Container) -> None:
        bus, grown = container.get(Bus), container.get(GrownOutputs)
        grown_runs = [process for process in tuple(container.get(ProcessQuery).running().oldest().all_rows()) if grown.has_new_bytes(process.id)]
        for process in grown_runs:
            bus.run(ReadNewOutput(process.id), Actor.core(), environment_id=process.environment_id)
        if grown_runs:
            self.wake_listeners()
