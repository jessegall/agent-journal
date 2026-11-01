import json
import re
from collections.abc import Mapping, Sequence

from core.base.refusal import Refusal
from core.base.type_guards import is_list, is_mapping


class SequenceGuards:
    """What each step of a sequence holds back, kept as JSON on the sequence: whether it allows file edits, and the commands it allows when it does not."""

    @staticmethod
    def parsed(text: str) -> Sequence[Mapping[object, object]]:
        try:
            guards: object = json.loads(text)
        except ValueError as error:
            raise Refusal(f"a sequence's step guards are JSON: {error}") from error
        if not is_list(guards):
            raise Refusal("a sequence's step guards are a list with one object for each step")
        checked = [guard for guard in guards if is_mapping(guard)]
        if len(checked) != len(guards):
            raise Refusal("a sequence's step guards are a list with one object for each step")
        for guard in checked:
            SequenceGuards.patterns(guard)
        return checked

    @staticmethod
    def patterns(guard: Mapping[object, object]) -> list[str]:
        patterns: object = guard["allowed_commands"] if "allowed_commands" in guard else []
        if not is_list(patterns):
            raise Refusal("a step guard's allowed_commands are a list of patterns")
        texts = [str(pattern) for pattern in patterns]
        for pattern in texts:
            try:
                re.compile(pattern)
            except re.error as error:
                raise Refusal(f"the pattern {pattern} does not read: {error}") from error
        return texts
