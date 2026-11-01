from collections.abc import Mapping
from dataclasses import dataclass
from typing import Self
import re

from core.base.refusal import Refusal
from core.base.type_guards import is_list


ALLOWED_COMMANDS = "allowed_commands"
FILE_EDITS_ALLOWED = "file_edits_allowed"


@dataclass(frozen=True)
class SequenceGuard:
    """What one step of a sequence holds back: whether it allows file edits, and the commands it allows when
    it does not."""

    file_edits_allowed: bool = True
    allowed_commands: tuple[str, ...] = ()

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
        return cls(bool(allowed), texts)
