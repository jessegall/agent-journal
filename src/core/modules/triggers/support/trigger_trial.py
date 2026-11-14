from dataclasses import dataclass


@dataclass(frozen=True)
class TriggerTrial:
    """Whether a trigger's words match a sentence, without firing it."""

    matches: bool
    phrases: tuple[str, ...]


