from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle


@dataclass(frozen=True)
class EnterAgentLine(MoveCommand[AgentLine]):
    move = AgentLineLifecycle.enter
