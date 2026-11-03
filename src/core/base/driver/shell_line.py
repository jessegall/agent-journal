import re
from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_fields import mapping, text, texts
from core.base.driver.part import Part
from core.base.type_guards import is_list


READ_CATEGORIES = (CommandCategory.READ, CommandCategory.SEARCH)
WATCHED_CATEGORIES = (CommandCategory.TEST_RUN, CommandCategory.BUILD, CommandCategory.CHECK)
JOURNAL_PROGRAM = "journal"
NO_FILE_REDIRECT = re.compile(r"^\d*>&\d+$|^\d*>\s*/dev/null$")


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
    def has_file_redirects(self) -> bool:
        return any(">" in redirect and not NO_FILE_REDIRECT.match(redirect) for redirect in self.redirects)

    @property
    def has_writes(self) -> bool:
        return self.has_file_redirects or any(CommandEffect.WRITES_FILES in part.classification.effects for part in self.parts)

    @property
    def is_reading(self) -> bool:
        return bool(self.parts) and all(part.classification.category in READ_CATEGORIES for part in self.parts) and not self.has_writes

    @property
    def watched_category(self) -> CommandCategory:
        watched_part = next((part for part in self.parts if part.classification.category in WATCHED_CATEGORIES), None)
        program_part = next((part for part in self.parts if part.classification.category is not CommandCategory.JOURNAL), None)
        return (watched_part or program_part or self.parts[0]).classification.category if self.parts else CommandCategory.UNKNOWN

    @property
    def has_full_test_run(self) -> bool:
        return any(part.is_full_test_run for part in self.parts)

    def has_category(self, category: CommandCategory) -> bool:
        return any(part.classification.category is category for part in self.parts)

    def journal_parts(self, *commands: str) -> tuple[Part, ...]:
        command_terms = tuple(tuple(command.split()) for command in commands)
        return tuple(part for part in self.parts if part.program == JOURNAL_PROGRAM and any(part.arguments[:len(terms)] == terms for terms in command_terms))

    def journal_numbers(self, *commands: str) -> tuple[int, ...]:
        firsts = (next((word for word in part.arguments if word.isdigit()), "") for part in self.journal_parts(*commands))
        return tuple(int(number) for number in firsts if number)

    def runs(self, command: str) -> bool:
        return any(part.text.strip("() ") == command or part.text.strip("() ").startswith(f"{command} ") for part in self.parts)

    def part_matches(self, pattern: str) -> bool:
        return any(re.search(pattern, part.text) for part in self.parts)
