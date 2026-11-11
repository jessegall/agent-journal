from dataclasses import dataclass


@dataclass(frozen=True)
class CadenceLimits:
    """The seconds that judge how a run prints: before a run that printed nothing is reported, before a run that
    stopped printing is reported, and the average gap between prints from which a run counts as sparse."""

    first_output_seconds: int
    stopped_writing_seconds: int
    sparse_seconds: int
