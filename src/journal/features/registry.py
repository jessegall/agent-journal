from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.repositories.settings import Settings


class Registry:
    """Every feature, and whether each is on in an environment. The catalogue, the bus and the console are filled from here at boot."""

    def __init__(self, features: tuple[type[Feature], ...], settings: Settings) -> None:
        self.features, self.settings = features, settings
        self._by_name = {feature.name: feature for feature in features}

    def on(self, environment_id: int) -> list[type[Feature]]:
        return [feature for feature in self.features if self.is_on(feature, environment_id)]

    def is_on(self, feature: type[Feature], environment_id: int) -> bool:
        return bool(self.settings.get(environment_id, f"features.{feature.name}", feature.default))

    def owner_of(self, nudge: Nudge) -> type[Feature]:
        return self._by_name[nudge.feature]

    def silenced(self, nudge: Nudge, environment_id: int) -> bool:
        return not self.is_on(self.owner_of(nudge), environment_id)
