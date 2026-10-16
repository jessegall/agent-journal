from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.skill import Skill
from journal.repositories.settings import Settings


class Registry:
    """Every feature, and whether each is on in an environment. The catalogue, the bus and the console are filled from here at boot."""

    def __init__(self, features: tuple[type[Feature], ...], settings: Settings) -> None:
        self.features, self.settings = features, settings
        self._by_name = {feature.name: feature for feature in features}
        self._by_state = {state.name: feature for feature in features for state in feature.states}

    def on(self, environment_id: int) -> list[type[Feature]]:
        return [feature for feature in self.features if self.is_on(feature, environment_id)]

    def is_on(self, feature: type[Feature], environment_id: int) -> bool:
        return bool(self.settings.get(environment_id, f"features.{feature.name}", feature.default))

    def skill_required_in(self, state: str) -> Skill | None:
        return next((skill for skill in self.skills() if state in skill.required_in), None)

    def options(self) -> list:
        """Every option a feature declares, across features."""
        return [option for feature in self.features for option in feature.options]

    def skills(self) -> list[Skill]:
        return [feature.skill for feature in self.features if feature.skill]

    def skill_named(self, name: str) -> Skill | None:
        return next((skill for skill in self.skills() if skill.name == name), None)

    def nudge_keyed(self, key: str) -> Nudge | None:
        return next((nudge for feature in self.features for nudge in feature.nudges if nudge.key == key), None)

    def owner_of(self, nudge: Nudge) -> type[Feature]:
        return self._by_name[nudge.feature]

    def silenced(self, nudge: Nudge, environment_id: int) -> bool:
        """A feature's nudge is silenced with its feature; the engine's own, with no feature, never are."""
        return bool(nudge.feature) and not self.is_on(self.owner_of(nudge), environment_id)
