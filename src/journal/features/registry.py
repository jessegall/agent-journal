from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.repositories.settings import Settings


class Registry:
    """Every feature, and whether each is on. The catalogue, the bus and the console are filled from here at boot."""

    def __init__(self, features: tuple[type[Feature], ...], settings: Settings) -> None: ...

    def on(self, environment_id: int) -> list[type[Feature]]: ...

    def owner_of(self, nudge: Nudge) -> type[Feature]: ...

    def silenced(self, nudge: Nudge) -> bool: ...
