from collections.abc import Mapping
from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from engine.driver.diff_count import DiffCount
from engine.driver.errors.hook_event_error import HookEventError
from engine.driver.hook_fields import mapping, mappings, text, texts
from engine.driver.shell_line import ShellLine
from engine.enums.tool_type import ToolType
from engine.skill.skill_declaration import SKILL_FILE

GRAPHIFY_PROGRAM = "graphify"


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
    def journal_commands(self) -> tuple[str, ...]:
        parts = [part for part in (self.shell.parts if self.shell is not None else ()) if part.classification.category is CommandCategory.JOURNAL and part.arguments]
        return tuple(sorted({part.subcommand or part.arguments[0] for part in parts} | {" ".join(part.arguments[:2]) for part in parts}))

    @property
    def is_readonly(self) -> bool:
        if self.category.reads_files:
            return True
        return self.shell is not None and self.shell.is_readonly

    @property
    def uses_graphify(self) -> bool:
        return self.shell is not None and any(part.program == GRAPHIFY_PROGRAM and part.classification.category is CommandCategory.SEARCH for part in self.shell.parts)

    @property
    def is_search(self) -> bool:
        if self.category is ToolType.SEARCH:
            return True
        return self.shell is not None and any(part.classification.category is CommandCategory.SEARCH for part in self.shell.parts)

    @property
    def searched_paths(self) -> tuple[str, ...]:
        if self.category is ToolType.SEARCH:
            return self.files
        parts = self.shell.parts if self.shell is not None else ()
        return tuple(path for part in parts if part.classification.category is CommandCategory.SEARCH for path in part.input_paths)

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
