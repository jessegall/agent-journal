from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.stop_hung_process.stop_hung_process import StopHungProcess
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_nudges import HUNG_RUN


class StopHungProcessHandler(Handler[StopHungProcess, Process]):
    """Stops a hung run, which keeps its output, and tells its agent, waking it, which run it was and how long
    it was idle."""

    command = StopHungProcess

    def __init__(self, queries: Queries, bus: Bus, nudger: Nudger) -> None:
        self.queries, self.bus, self.nudger = queries, bus, nudger

    def handle(self, command: StopHungProcess, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if process.state not in RUNNING_STATES:
            return process
        process = self.bus.dispatch(StopProcess(process.id), context)
        self.nudger.send(process.session_agent_id, HUNG_RUN, "processes.hung", context, output=process.id, seconds=command.seconds)
        return process
