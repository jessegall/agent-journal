from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.part_spec import PartSpec
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class StartProcess(Command[Process]):
    """Makes the process of a shell line and a part for each of its commands, in the hook call's transaction."""

    agent_id: int
    hook_call_id: int | None
    line: str
    folder: str
    shell: str
    category: CommandCategory
    limit_seconds: int
    parts: Sequence[PartSpec]
