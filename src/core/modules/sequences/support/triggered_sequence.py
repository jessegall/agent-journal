from dataclasses import dataclass

from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.support.sequence_trigger import SequenceTrigger


@dataclass(frozen=True)
class TriggeredSequence:
    sequence: Sequence
    trigger: SequenceTrigger
