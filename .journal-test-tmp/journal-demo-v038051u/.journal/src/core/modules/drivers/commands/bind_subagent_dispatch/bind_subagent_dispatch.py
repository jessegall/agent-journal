from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch


@dataclass(frozen=True)
class BindSubagentDispatch(Command[SubagentDispatch | None]):
    """Tie a subagent that started to the oldest dispatch of its profile that has none yet."""

    parent_id: int
    profile: str
    subagent_id: int
