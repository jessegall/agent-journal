import json

from engine.errors.refusal import Refusal
from engine.types.type_guards import is_list, is_mapping
from core.modules.sequences.models.support.sequence_trigger import SequenceTrigger


class SequenceTriggers:
    """What starts a sequence on its own, kept as JSON on the sequence: a record made, words in the user's
    prompt,
    a command, an edited file, a text an edit adds, or a tool used. A row trigger can also name the events
    that end
    the sequence it started."""

    @staticmethod
    def parsed(text: str) -> tuple[SequenceTrigger, ...]:
        try:
            decoded: object = json.loads(text)
        except ValueError as error:
            raise Refusal(f"a sequence's triggers are JSON: {error}") from error
        if not is_list(decoded):
            raise Refusal("a sequence's triggers are a list")
        if not all(is_mapping(trigger) for trigger in decoded):
            raise Refusal("a sequence's trigger is an object")
        triggers = tuple(SequenceTrigger.parsed(trigger) for trigger in decoded if is_mapping(trigger))
        for trigger in triggers:
            trigger.check()
        return triggers
