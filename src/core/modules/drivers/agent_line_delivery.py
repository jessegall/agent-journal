from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.base.timestamp import Timestamp
from core.modules.drivers.agent_line import AgentLine
from core.modules.drivers.agent_line_lifecycle import AgentLineLifecycle


@dataclass(frozen=True)
class AgentLineDelivery(MoveCommand[AgentLine]):
    move = AgentLineLifecycle.deliver
    hook_call_id: int
    delivered_at: Timestamp
