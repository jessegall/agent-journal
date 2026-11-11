from pathlib import Path

from engine.command.context import Context
from engine.command.handler import Handler
from engine.provider.launch_command import LaunchCommand
from core.modules.agents.commands.start_agent_program.start_agent_program import StartAgentProgram
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_rows import AgentRows


class StartAgentProgramHandler(Handler[StartAgentProgram, Dispatch]):
    """Hands the start of an agent's program to the dispatcher."""

    command = StartAgentProgram

    def __init__(self, dispatcher: AgentDispatcher, agents: AgentRows) -> None:
        self.dispatcher, self.agents = dispatcher, agents

    def handle(self, command: StartAgentProgram, context: Context) -> Dispatch:
        launch = LaunchCommand(tuple(command.arguments), Path(command.folder), dict(command.variables))
        return self.dispatcher.start(self.agents.find(command.agent_id), launch)
