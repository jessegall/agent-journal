from collections import defaultdict
from collections.abc import Iterable
from dataclasses import dataclass

from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.support.sequence_trigger import ROW_TRIGGER
from core.modules.sequences.support.sequence_triggers import SequenceTriggers
from core.modules.sequences.support.triggered_sequence import TriggeredSequence


@dataclass(frozen=True)
class SequenceEventIndex:
    starts: dict[str, tuple[TriggeredSequence, ...]]
    ends: dict[str, frozenset[int]]

    @classmethod
    def built(cls, sequences: Iterable[Sequence]) -> "SequenceEventIndex":
        starts: dict[str, list[TriggeredSequence]] = defaultdict(list)
        ends: dict[str, set[int]] = defaultdict(set)
        for sequence in sequences:
            for trigger in SequenceTriggers.parsed(sequence.triggers):
                if trigger.trigger_type != ROW_TRIGGER:
                    continue
                starts[trigger.event].append(TriggeredSequence(sequence, trigger))
                for event in trigger.end_event_names:
                    ends[event].add(sequence.id)
        return cls({event: tuple(rows) for event, rows in starts.items()}, {event: frozenset(ids) for event, ids in ends.items()})
