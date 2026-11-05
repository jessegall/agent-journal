from collections.abc import Mapping
from dataclasses import dataclass

from core.base.driver.diff_count import DiffCount
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_fields import mapping, mappings, text, texts
from core.base.driver.shell_line import ShellLine
from core.base.driver.tool_type import ToolType
from core.base.skill.skill_declaration import SKILL_FILE


@dataclass(frozen=True)
class Tool:
    """The tool a hook is about: its name, its category, the files it names, its shell line when it runs one,
    and its diff and the changed lines when it edits or writes."""

    name: str
    category: ToolType
    files: tuple[str, ...]
    shell: ShellLine | None
    diff: DiffCount | None
    diff_rows: tuple[Mapping[str, object], ...] = ()

    @classmethod
    def parsed(cls, data: object) -> "Tool":
        fields = mapping(data, "tool")
        shell, diff = fields.get("shell"), fields.get("diff")
        category = text(fields, "category")
        if category not in ToolType:
            raise HookEventError(f"a tool's category is one of {', '.join(ToolType)}, not {category!r}")
        return cls(text(fields, "name"), ToolType(category), texts(fields, "files"), ShellLine.parsed(shell) if shell is not None else None,
                   DiffCount.parsed(diff) if diff is not None else None, mappings(fields.get("diff_rows"), "diff_rows"))

    @property
    def lines_added(self) -> int:
        return self.diff.lines_added if self.diff is not None else 0

    @property
    def lines_removed(self) -> int:
        return self.diff.lines_removed if self.diff is not None else 0

    @property
    def is_journal_line(self) -> bool:
        return self.shell is not None and self.shell.is_journal_line

    @property
    def is_readonly(self) -> bool:
        if self.category.reads_files:
            return True
        return self.shell is not None and self.shell.is_readonly

    @property
    def is_skill_read(self) -> bool:
        return self.category.reads_files and bool(self.files) and all(path.endswith(SKILL_FILE) for path in self.files)

    @property
    def block_exempt(self) -> bool:
        if self.category.reads_files:
            return True
        if self.shell is None or self.shell.has_file_redirect or not self.shell.parts:
            return False
        return all(part.classification.category.is_readonly for part in self.shell.parts)

    def is_writing_files(self) -> bool:
        if self.category.writes_files:
            return True
        return self.shell is not None and self.shell.has_part_writing_files
