from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path

from core.base.command.command import Command
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.shell_line import ShellLine
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_run import ForegroundRun


@dataclass(frozen=True)
class StartProcess(Command[Process]):
    """Makes the process of a shell line and a part for each of its commands, in the hook call's transaction.
    """

    agent_id: int
    hook_call_id: int | None
    line: str
    folder: str
    shell: str
    category: CommandCategory
    limit_seconds: int
    parts: Sequence[PartSpec]
    reader_id: int | None = None
    is_full_test_run: bool = False
    owner_agent_id: int | None = None
    task_id: int | None = None
    timeout_durations: tuple[str, ...] = ()
    plugin: str = ""

    @classmethod
    def single_part(cls, agent_id: int, line: str, folder: str, category: CommandCategory, limit_seconds: int, plugin: str = "") -> "StartProcess":
        return cls(agent_id, None, line, folder, "", category, limit_seconds, [PartSpec(line, line.split()[0], False, category)], plugin=plugin)

    @classmethod
    def build(cls, hook: AgentHook, shell: ShellLine, run: ForegroundRun) -> "StartProcess":
        folder = hook.event.raw.get("cwd")
        parts = tuple(PartSpec(part.text, part.program, part.pipe_target is not None, command.category, command.command, command.named_reader_id,
                              part.arguments[0] if part.program == "journal" and part.arguments else " ".join(value for value in (Path(part.program).name, part.subcommand) if value))
                      for part, command in zip(shell.parts, run.part_commands, strict=True))
        return cls(hook.agent_id, None, shell.runner_text, folder if isinstance(folder, str) else "", "", run.category or shell.watched_part_category, run.seconds, parts, run.reader_id, shell.has_full_test_run, timeout_durations=run.timeout_durations)
