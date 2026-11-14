from dataclasses import dataclass

from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run_row import SequenceRunRow


@dataclass(frozen=True)
class SequenceBoard:
    """The sequences and their running instances."""

    sequences: tuple[Sequence, ...]
    runs: tuple[SequenceRunRow, ...]
