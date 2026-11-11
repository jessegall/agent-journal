from collections.abc import Callable, Sequence
import re
from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.driver.errors.hook_event_error import HookEventError
from engine.driver.hook_fields import mapping, text, texts
from engine.driver.part import Part
from engine.types.type_guards import is_list


JOURNAL_PROGRAM = "journal"
SKIP_ARGUMENTS = ("alias", "skip")
DESCRIPTOR_REDIRECT = re.compile(r"^\d*>&\d+$|^\d*>\s*/dev/null$")


@dataclass(frozen=True)
class ShellLine:
    """A shell tool's line split into its parts, with its redirects, whether it runs only journal commands, and
    the parse error of a line no shell reads. What the line does is asked of its parts: any part that tests
    makes the line one that tests. The source line is private: it is only shown, or handed to the runner."""

    _source_line: str
    parts: tuple[Part, ...]
    redirects: tuple[str, ...]
    is_journal_line: bool
    parse_error: str
    alias_names: tuple[str, ...] = ()
    aliases_loaded: bool = False
    is_retry_loop: bool = False

    @classmethod
    def parsed(cls, data: object) -> "ShellLine":
        fields = mapping(data, "shell")
        parts = fields.get("parts", [])
        if not is_list(parts):
            raise HookEventError("parts is a list")
        return cls(text(fields, "line"), tuple(Part.parsed(part) for part in parts), texts(fields, "redirects"), fields.get("is_journal_only") is True, text(fields, "parse_error"), texts(fields, "aliases"), fields.get("saved_commands_known") is True, fields.get("retry_loop") is True)

    @property
    def display_text(self) -> str:
        return self._source_line

    @property
    def runner_text(self) -> str:
        return self._source_line

    @property
    def part_texts(self) -> tuple[str, ...]:
        return tuple(part.text for part in self.parts)

    @property
    def pipeline_heads(self) -> tuple[Part, ...]:
        return tuple(part for index, part in enumerate(self.parts) if index == 0 or self.parts[index - 1].pipe_target is None)

    @property
    def has_uncertain_part(self) -> bool:
        return self.has_old_hook_part or any(part.classification.uncertain for part in self.parts)

    @property
    def has_old_hook_part(self) -> bool:
        return any(part.classification.uncertainty_absent for part in self.parts)

    @property
    def has_test_run_part(self) -> bool:
        return self.has_category_part(CommandCategory.TEST_RUN)

    @property
    def has_build_part(self) -> bool:
        return self.has_category_part(CommandCategory.BUILD)

    @property
    def has_check_part(self) -> bool:
        return self.has_category_part(CommandCategory.CHECK)

    @property
    def has_file_redirect(self) -> bool:
        return any(">" in redirect and not DESCRIPTOR_REDIRECT.match(redirect) for redirect in self.redirects)

    @property
    def has_part_writing_files(self) -> bool:
        return self.has_file_redirect or any(CommandEffect.WRITES_FILES in part.classification.effects for part in self.parts)

    @property
    def has_non_journal_file_writes(self) -> bool:
        return self.has_file_redirect or any(CommandEffect.WRITES_FILES in part.classification.effects
                                             for part in self.parts if part.classification.category is not CommandCategory.JOURNAL)

    @property
    def is_readonly(self) -> bool:
        return bool(self.parts) and all(part.classification.category.reads_files for part in self.parts) and not self.has_part_writing_files

    @property
    def watched_part_category(self) -> CommandCategory:
        watched_part = next((part for part in self.parts if part.classification.category.is_watched), None)
        program_part = next((part for part in self.parts if part.classification.category is not CommandCategory.JOURNAL), None)
        return (watched_part or program_part or self.parts[0]).classification.category if self.parts else CommandCategory.UNKNOWN

    @property
    def has_full_test_run(self) -> bool:
        return not self.is_skip_line and any(part.is_full_test_run for part in self.parts)

    @property
    def is_skip_line(self) -> bool:
        first = self.parts[0] if self.parts else None
        return first is not None and first.program == JOURNAL_PROGRAM and first.arguments[:2] == SKIP_ARGUMENTS and first.next_operator == "&&"

    def has_category_part(self, category: CommandCategory) -> bool:
        return any(part.classification.category is category for part in self.parts)

    def disallowed_part(self, categories: Sequence[str]) -> Part | None:
        return next((part for part in self.parts if part.classification.category is not CommandCategory.JOURNAL
                     and part.classification.category.value not in categories), None)

    def denied_program_part(self, programs: Sequence[str]) -> Part | None:
        return next((part for part in self.parts if part.program in programs), None)

    def all_alias_names(self, is_alias: Callable[[str], bool]) -> tuple[str, ...]:
        commands = tuple(part.arguments[0] for part in self.parts_running_journal_command() if part.arguments and is_alias(part.arguments[0]))
        return tuple(dict.fromkeys((*self.alias_names, *commands)))

    def parts_running_journal_command(self, *commands: str) -> tuple[Part, ...]:
        command_terms = tuple(tuple(command.split()) for command in commands)
        return tuple(part for part in self.parts if part.program == JOURNAL_PROGRAM and (not command_terms or any(part.arguments[:len(terms)] == terms for terms in command_terms)))

    def is_journal_command_line(self, *commands: str) -> bool:
        return bool(self.parts) and len(self.parts_running_journal_command(*commands)) == len(self.parts)

    def journal_command_numbers(self, *commands: str) -> tuple[int, ...]:
        first_numbers = (next((word for word in part.arguments if word.isdigit()), "") for part in self.parts_running_journal_command(*commands))
        return tuple(dict.fromkeys(int(number) for number in first_numbers if number))

    def has_part_running(self, command: str) -> bool:
        return any(part.text.strip("() ") == command or part.text.strip("() ").startswith(f"{command} ") for part in self.parts)

    def has_part_naming(self, names: Sequence[str]) -> bool:
        return any(part.names_any(names) for part in self.parts)

    def is_permitted_line(self, action: str) -> bool:
        return action == self._source_line

    def runs_journal_command(self, *commands: str) -> bool:
        lines = [*(part.arguments for part in self.parts if part.program == JOURNAL_PROGRAM), *(nested for part in self.parts for nested in part.nested_journal_commands)]
        return any(tuple(line[:len(command.split())]) == tuple(command.split()) for line in lines for command in commands)

    def has_part_matching(self, pattern: str) -> bool:
        return any(re.search(pattern, part.text) for part in self.parts)
