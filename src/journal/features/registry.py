from journal.engine.agent_state import AgentState
from journal.engine.conduct import Conduct
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.support.service import Service
from journal.support.skill import Skill
from journal.repositories.setting_rows import SettingRows


class Registry:
    """Every feature, and whether each is on in an environment. The catalogue, the bus and the console are filled from here at boot."""

    def __init__(self, features: tuple[type[Feature], ...], settings: SettingRows) -> None:
        self.features, self.settings = features, settings
        self._by_name = {feature.name: feature for feature in features}
        self._by_state = {state.name: feature for feature in features for state in feature.states}

    def has_feature(self, name: str) -> bool:
        return name in self._by_name

    def is_on(self, feature: type[Feature]) -> bool:
        return feature.fixed or bool(self.settings.get(f"features.{feature.name}", feature.default))

    def skill_required_in(self, state: str) -> Skill | None:
        return next((skill for skill in self.skills() if state in skill.required_in), None)

    def options(self) -> list:
        return [option for feature in self.features for option in feature.options]

    def conducts(self) -> tuple[type[Conduct], ...]:
        return tuple(conduct for feature in self.features for conduct in feature.conduct)

    def states(self) -> list[type[AgentState]]:
        return [state for feature in self.features for state in feature.states]

    def services(self) -> list[Service]:
        return [service for feature in self.features for service in feature.services]

    def skills(self) -> list[Skill]:
        return [feature.skill for feature in self.features if feature.skill]

    def skill_named(self, name: str) -> Skill | None:
        return next((skill for skill in self.skills() if skill.name == name), None)

    def nudge_keyed(self, key: str) -> Nudge | None:
        return next((nudge for feature in self.features for nudge in feature.nudges if nudge.key == key), None)

    def owner_of(self, nudge: Nudge) -> type[Feature]:
        return self._by_name[nudge.feature]

    def silenced(self, nudge: Nudge) -> bool:
        return nudge.feature in self._by_name and not self.is_on(self.owner_of(nudge))
