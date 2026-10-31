from dataclasses import dataclass

from core.base.driver.diff_count import DiffCount
from core.base.driver.hook_fields import mapping, text, texts
from core.base.driver.shell_line import ShellLine


@dataclass(frozen=True)
class Tool:
    """The tool a hook is about: its name, its category, the files it names, its shell line when it runs one, and
    its diff when it edits or writes."""

    name: str
    category: str
    files: tuple[str, ...]
    shell: ShellLine | None
    diff: DiffCount | None

    @classmethod
    def parsed(cls, data: object) -> "Tool":
        fields = mapping(data, "tool")
        shell, diff = fields.get("shell"), fields.get("diff")
        return cls(text(fields, "name"), text(fields, "kind"), texts(fields, "files"), ShellLine.parsed(shell) if shell is not None else None,
                   DiffCount.parsed(diff) if diff is not None else None)
