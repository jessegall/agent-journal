from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.commands.timeout_process.timeout_process import TimeoutProcess
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_nudges import OUTPUT_TIMED_OUT


class TimeoutProcessHandler(Handler[TimeoutProcess, Process]):
    """Stops an expired run and tells its agent why it stopped."""

    command = TimeoutProcess

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, nudger: Nudger) -> None:
        self.queries, self.repository, self.bus, self.nudger = queries, repository, bus, nudger

    def handle(self, command: TimeoutProcess, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if process.state not in RUNNING_STATES or not process.has_expired_timeout(context.timestamp):
            return process
        self.repository.save(replace(process, timed_out_at=context.timestamp), context)
        process = self.bus.dispatch(StopProcess(process.id), context)
        self.nudger.send(process.agent_id, OUTPUT_TIMED_OUT, "processes.timeout", context, output=process.id, seconds=process.timeout_seconds)
        return process
