from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.shell_line import ShellLine
from core.modules.processes.commands.part_spec import PartSpec
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_limit import ForegroundRun


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

    @classmethod
    def of(cls, hook: AgentHook, shell: ShellLine, run: ForegroundRun) -> "StartProcess":
        folder = hook.event.raw.get("cwd")
        parts = tuple(PartSpec(part.text, part.program, part.pipe_target is not None) for part in shell.parts)
        return cls(hook.agent_id, None, shell.line, folder if isinstance(folder, str) else "", "", shell.category, run.seconds, parts)
