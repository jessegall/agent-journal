from dataclasses import dataclass

from core.modules.sequences.models.support.sequence_trigger import SequenceTrigger


@dataclass(frozen=True)
class SequenceTriggerList:
    """The parsed triggers of one sequence that starts on its own."""

    sequence_id: int
    triggers: tuple[SequenceTrigger, ...]
