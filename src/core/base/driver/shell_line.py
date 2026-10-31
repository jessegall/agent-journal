from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_fields import mapping, text, texts
from core.base.driver.part import Part
from core.base.type_guards import is_list


@dataclass(frozen=True)
class ShellLine:
    """A shell tool's line split into its parts, with its redirects, the category of its heaviest part, whether
    it runs only journal commands, and the parse error of a line no shell reads."""

    line: str
    parts: tuple[Part, ...]
    redirects: tuple[str, ...]
    category: CommandCategory
    is_journal_line: bool
    parse_error: str

    @classmethod
    def parsed(cls, data: object) -> "ShellLine":
        fields = mapping(data, "shell")
        parts = fields.get("parts", [])
        if not is_list(parts):
            raise HookEventError("parts is a list")
        category = text(fields, "category")
        if category not in CommandCategory:
            raise HookEventError(f"a shell line's category is one of {', '.join(CommandCategory)}, not {category!r}")
        return cls(text(fields, "line"), tuple(Part.parsed(part) for part in parts), texts(fields, "redirects"), CommandCategory(category),
                   fields.get("is_journal_only") is True, text(fields, "parse_error"))
