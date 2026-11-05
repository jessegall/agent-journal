from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.base.timestamp import Timestamp
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle


@dataclass(frozen=True)
class DeliverAgentLine(MoveCommand[AgentLine]):
    move = AgentLineLifecycle.deliver
    hook_call_id: int
    delivered_at: Timestamp
