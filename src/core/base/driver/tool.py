from dataclasses import dataclass

from core.base.driver.command_effect import CommandEffect
from core.base.driver.diff_count import DiffCount
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_fields import mapping, text, texts
from core.base.driver.shell_line import ShellLine
from core.base.driver.tool_type import ToolType

WRITING_CATEGORIES = (ToolType.EDIT, ToolType.NEW_FILE)


@dataclass(frozen=True)
class Tool:
    """The tool a hook is about: its name, its category, the files it names, its shell line when it runs one, and
    its diff when it edits or writes."""

    name: str
    category: ToolType
    files: tuple[str, ...]
    shell: ShellLine | None
    diff: DiffCount | None

    @classmethod
    def parsed(cls, data: object) -> "Tool":
        fields = mapping(data, "tool")
        shell, diff = fields.get("shell"), fields.get("diff")
        category = text(fields, "category")
        if category not in ToolType:
            raise HookEventError(f"a tool's category is one of {', '.join(ToolType)}, not {category!r}")
        return cls(text(fields, "name"), ToolType(category), texts(fields, "files"), ShellLine.parsed(shell) if shell is not None else None,
                   DiffCount.parsed(diff) if diff is not None else None)

    def is_writing_files(self) -> bool:
        if self.category in WRITING_CATEGORIES:
            return True
        return self.shell is not None and (bool(self.shell.redirects) or any(CommandEffect.WRITES_FILES in part.classification.effects for part in self.shell.parts))
