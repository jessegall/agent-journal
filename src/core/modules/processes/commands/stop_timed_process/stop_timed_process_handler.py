from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.driver.message_sender import MessageSender
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.commands.stop_timed_process.stop_timed_process import StopTimedProcess
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.agent_messages.output_timeout_message import OutputTimeoutMessage


class StopTimedProcessHandler(Handler[StopTimedProcess, Process]):
    """Stops an expired run and tells its agent why it stopped."""

    command = StopTimedProcess

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, message_sender: MessageSender) -> None:
        self.queries, self.repository, self.bus, self.message_sender = queries, repository, bus, message_sender

    def handle(self, command: StopTimedProcess, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if process.state not in RUNNING_STATES or not process.has_expired_timeout(context.timestamp):
            return process
        self.repository.save(replace(process, expired_at=context.timestamp), context)
        process = self.bus.dispatch(StopProcess(process.id), context)
        self.message_sender.send(process.session_agent_id, OutputTimeoutMessage.declared(), "processes.timeout", context, output=process.id, seconds=process.timeout_seconds)
        return process
