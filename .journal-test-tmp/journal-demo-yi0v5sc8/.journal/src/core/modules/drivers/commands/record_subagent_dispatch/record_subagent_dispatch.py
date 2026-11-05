from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch


@dataclass(frozen=True)
class RecordSubagentDispatch(Command[SubagentDispatch]):
    """Keeps a dispatch when it is sent, or records what it returned when one with this key has ended."""

    environment_id: int
    agent_id: int
    tool_key: str
    profile: str
    program_model: str
    description: str
    instruction: str
    returned: str = ""
    is_ended: bool = False
