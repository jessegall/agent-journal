from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_fields import mapping, text, texts
from core.base.driver.part import Part
from core.base.type_guards import is_list


READ_CATEGORIES = (CommandCategory.READ, CommandCategory.SEARCH)
WATCHED_CATEGORIES = (CommandCategory.TEST_RUN, CommandCategory.BUILD, CommandCategory.CHECK)


@dataclass(frozen=True)
class ShellLine:
    """A shell tool's line split into its parts, with its redirects, whether it runs only journal commands, and
    the parse error of a line no shell reads. What the line does is asked of its parts: any part that tests
    makes the line one that tests."""

    line: str
    parts: tuple[Part, ...]
    redirects: tuple[str, ...]
    is_journal_line: bool
    parse_error: str

    @classmethod
    def parsed(cls, data: object) -> "ShellLine":
        fields = mapping(data, "shell")
        parts = fields.get("parts", [])
        if not is_list(parts):
            raise HookEventError("parts is a list")
        return cls(text(fields, "line"), tuple(Part.parsed(part) for part in parts), texts(fields, "redirects"), fields.get("is_journal_only") is True, text(fields, "parse_error"))

    @property
    def has_tests(self) -> bool:
        return self.has_category(CommandCategory.TEST_RUN)

    @property
    def has_builds(self) -> bool:
        return self.has_category(CommandCategory.BUILD)

    @property
    def has_checks(self) -> bool:
        return self.has_category(CommandCategory.CHECK)

    @property
    def has_writes(self) -> bool:
        return bool(self.redirects) or any(CommandEffect.WRITES_FILES in part.classification.effects for part in self.parts)

    @property
    def is_reading(self) -> bool:
        return bool(self.parts) and all(part.classification.category in READ_CATEGORIES for part in self.parts) and not self.has_writes

    @property
    def watched_category(self) -> CommandCategory:
        run = next((part for part in self.parts if part.classification.category in WATCHED_CATEGORIES), None)
        return (run or self.parts[0]).classification.category if self.parts else CommandCategory.UNKNOWN

    def has_category(self, category: CommandCategory) -> bool:
        return any(part.classification.category is category for part in self.parts)
