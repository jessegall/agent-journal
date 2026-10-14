from dataclasses import dataclass

from journal.features.nudge import Nudge


@dataclass(frozen=True)
class Said(Nudge):
    """A nudge with its values filled in, ready to render and send."""

    values: dict = None

    def rendered(self) -> str: ...
