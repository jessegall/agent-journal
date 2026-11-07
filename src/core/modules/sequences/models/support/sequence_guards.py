import json

from core.base.refusal import Refusal
from core.base.type_guards import is_list, is_mapping
from core.modules.sequences.models.support.sequence_guard import SequenceGuard


class SequenceGuards:
    """What each step of a sequence holds back, kept as JSON on the sequence."""

    @staticmethod
    def parsed(text: str) -> tuple[SequenceGuard, ...]:
        try:
            decoded: object = json.loads(text)
        except ValueError as error:
            raise Refusal(f"a sequence's step guards are JSON: {error}") from error
        if not is_list(decoded) or not all(is_mapping(guard) for guard in decoded):
            raise Refusal("a sequence's step guards are a list with one object for each step")
        return tuple(SequenceGuard.parsed(guard) for guard in decoded if is_mapping(guard))

    @staticmethod
    def step_guard(text: str, step_number: int) -> SequenceGuard:
        guards = SequenceGuards.parsed(text)
        return guards[step_number - 1] if step_number <= len(guards) else SequenceGuard()
