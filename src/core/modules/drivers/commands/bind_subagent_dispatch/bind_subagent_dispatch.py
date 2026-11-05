from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.helper_job import HelperJob


@dataclass(frozen=True)
class BindSubagentDispatch(Command[HelperJob | None]):
    """Tie a subagent that started to the oldest dispatch of its profile that has none yet."""

    parent_id: int
    profile: str
    helper_id: int
