from dataclasses import dataclass

from journal.models.trigger import Trigger


@dataclass(frozen=True)
class TriggersReadings:
    """The triggers feature's reading: every trigger the user set here."""

    triggers: tuple[Trigger, ...]
