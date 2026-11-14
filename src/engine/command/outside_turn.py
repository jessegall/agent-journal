from collections.abc import Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class OutsideTurn:
    """One place in a round where a command reaches outside work: its form, its log name and how many times the round
    reached them before, with the answers of an earlier round, if any."""

    form: str
    log_name: str
    position: int
    answers: Sequence[object] | None = None

    @property
    def has_answers(self) -> bool:
        return self.answers is not None
