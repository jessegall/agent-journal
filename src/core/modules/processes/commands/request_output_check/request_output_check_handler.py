from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.driver.nudger import MessageSender
from core.modules.processes.commands.request_output_check.request_output_check import RequestOutputCheck
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.nudges.run_check_message import RunCheckMessage


class RequestOutputCheckHandler(Handler[RequestOutputCheck, Process]):
    """Tells the agent of a running run, waking it, to read the run's output and decide whether to stop it."""

    command = RequestOutputCheck

    def __init__(self, queries: Queries, nudger: MessageSender) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, command: RequestOutputCheck, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if process.state in RUNNING_STATES:
            self.nudger.send(process.session_agent_id, RunCheckMessage.declared(), "processes.look", context, output=process.id, seconds=command.seconds)
        return process
