import json
import re
from collections.abc import Mapping, Sequence

from core.base.refusal import Refusal


class SequenceGuards:
    """What each step of a sequence holds back, kept as JSON on the sequence: whether it allows file edits, and the commands it allows when it does not."""

    @staticmethod
    def parsed(text: str) -> Sequence[Mapping[str, object]]:
        try:
            guards = json.loads(text)
        except ValueError as error:
            raise Refusal(f"a sequence's step guards are JSON: {error}") from error
        if not isinstance(guards, list) or not all(isinstance(guard, dict) for guard in guards):
            raise Refusal("a sequence's step guards are a list with one object for each step")
        for guard in guards:
            SequenceGuards.check(guard)
        return guards

    @staticmethod
    def check(guard: Mapping[str, object]) -> None:
        patterns = guard.get("allowed_commands", [])
        if not isinstance(patterns, list):
            raise Refusal("a step guard's allowed_commands are a list of patterns")
        for pattern in patterns:
            try:
                re.compile(str(pattern))
            except re.error as error:
                raise Refusal(f"the pattern {pattern} does not read: {error}") from error
