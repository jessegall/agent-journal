from collections.abc import Mapping
from dataclasses import dataclass
from typing import Self
import re

from core.base.refusal import Refusal
from core.base.type_guards import is_list


ALLOWED_COMMANDS = "allowed_commands"
FILE_EDITS_ALLOWED = "file_edits_allowed"
CHECKS = "checks"
REFUSED_COMMANDS = "refused_commands"
CONDITIONS = "conditions"


@dataclass(frozen=True)
class SequenceGuard:
    """What one step of a sequence holds back: whether it allows file edits, the commands it allows when it
    does not, the commands it refuses, and the checks and conditions that must hold before the step can advance
    or the sequence can finish."""

    file_edits_allowed: bool = True
    allowed_commands: tuple[str, ...] = ()
    checks: tuple[int, ...] = ()
    refused_commands: tuple[str, ...] = ()
    conditions: tuple[str, ...] = ()

    @classmethod
    def parsed(cls, values: Mapping[object, object]) -> Self:
        allowed = values[FILE_EDITS_ALLOWED] if FILE_EDITS_ALLOWED in values else True
        patterns = values.get(ALLOWED_COMMANDS, ())
        if not is_list(patterns) and patterns != ():
            raise Refusal("a step guard's allowed_commands are a list of patterns")
        texts = tuple(str(pattern) for pattern in patterns) if is_list(patterns) else ()
        for pattern in texts:
            try:
                re.compile(pattern)
            except re.error as error:
                raise Refusal(f"the pattern {pattern} does not read: {error}") from error
        numbers = values.get(CHECKS, [])
        if not is_list(numbers) or not all(isinstance(number, int) and not isinstance(number, bool) for number in numbers):
            raise Refusal("a step guard's checks are a list of check numbers", "such as [3, 5]")
        return cls(bool(allowed), texts, tuple(number for number in numbers if isinstance(number, int)), cls.words(values, REFUSED_COMMANDS), cls.words(values, CONDITIONS))

    @staticmethod
    def words(values: Mapping[object, object], field: str) -> tuple[str, ...]:
        listed = values.get(field, [])
        if not is_list(listed):
            raise Refusal(f"a step guard's {field} are a list of words")
        return tuple(str(word) for word in listed)
