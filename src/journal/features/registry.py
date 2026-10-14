from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Registry:
    """Every feature, and whether each is on. The catalogue, the bus and the console are filled from here at boot."""

    def __init__(self, features: tuple[type[Feature], ...]) -> None: ...

    def on(self) -> list[type[Feature]]: ...

    def owner_of(self, nudge: Nudge) -> type[Feature]: ...

    def silenced(self, nudge: Nudge) -> bool: ...
