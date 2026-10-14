from dataclasses import dataclass


@dataclass(frozen=True)
class Instruction:
    """One datagram from the journal, as the supervisor acts on it."""

    @classmethod
    def parse(cls, datagram: bytes) -> "Instruction": ...
