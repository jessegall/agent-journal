from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.commands.stop_agent_program.stop_agent_program import StopAgentProgram
from core.modules.agents.models.enums.stopped import Stopped
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_rows import AgentRows


class StopAgentProgramHandler(Handler[StopAgentProgram, Stopped]):
    """Hands the stop of an agent's program to the dispatcher."""

    command = StopAgentProgram

    def __init__(self, dispatcher: AgentDispatcher, agents: AgentRows) -> None:
        self.dispatcher, self.agents = dispatcher, agents

    def handle(self, command: StopAgentProgram, context: Context) -> Stopped:
        return self.dispatcher.stop(self.agents.find(command.agent_id), command.reason, context)
