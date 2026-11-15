from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PruneDriverComparisons(Command[None]):
    """Deletes the oldest comparisons of the old and the new driver past the days the journal keeps; the count cap is
    the model's own, kept by the row pruning."""
