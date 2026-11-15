from dataclasses import dataclass

from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.provider.provider import Provider


@dataclass(frozen=True)
class ToolAllowance:
    """The tool types and shell command categories an agent may use, and the line that refuses the rest: a tool
    of another type, a shell line that cannot be read, a file write outside the journal where edits are not
    allowed, or a part of another category. A program's agent that only reads a web page is allowed."""

    tools: tuple[ToolType, ...]
    commands: tuple[CommandCategory, ...]
    refusal: NudgeDeclaration

    def refused(self, event: HookEvent, provider: Provider) -> Nudge | None:
        tool = event.tool
        if tool is None or provider.uses_web_reader(event):
            return None
        if tool.category not in self.tools or (tool.category is ToolType.SHELL and tool.shell is None):
            return self.refusal.nudge(category=tool.category.value)
        shell = tool.shell
        if shell is None:
            return None
        allowed = tuple(category.value for category in self.commands)
        if shell.parse_error or not shell.parts:
            return self.refusal.nudge(category=CommandCategory.UNKNOWN.value)
        if shell.has_non_journal_file_writes and CommandCategory.EDIT.value not in allowed:
            return self.refusal.nudge(category=CommandCategory.EDIT.value)
        refused = shell.disallowed_part(allowed)
        return self.refusal.nudge(category=refused.classification.category.value) if refused is not None else None
