from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.ask_agent_to_look.ask_agent_to_look import AskAgentToLook
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_nudges import LOOK_AT_RUN


class AskAgentToLookHandler(Handler[AskAgentToLook, Process]):
    """Tells the agent of a running run, waking it, to read the run's output and decide whether to stop it."""

    command = AskAgentToLook

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, command: AskAgentToLook, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if process.state in RUNNING_STATES:
            self.nudger.send(process.session_agent_id, LOOK_AT_RUN, "processes.look", context, output=process.id, seconds=command.seconds)
        return process
