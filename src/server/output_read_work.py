from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.grown_outputs import GrownOutputs
from server.round_work import RoundWork


class OutputReadWork(RoundWork):
    """The output read round, every few seconds: a running output that grew goes through its reader, so a run's
    row and mark show its progress as it happens and not only at the minute's tick."""

    def run(self, container: Container) -> None:
        bus, grown = container.get(Bus), container.get(GrownOutputs)
        for process in tuple(container.get(ProcessQuery).running().oldest().all_rows()):
            if grown.has_new_bytes(process.id):
                bus.run(ReadNewOutput(process.id), Actor.core(), environment_id=process.environment_id)
