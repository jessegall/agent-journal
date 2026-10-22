from journal.features.registry import Registry
from journal.support.option_scope import OptionScope


class SettingScopes:
    """Which settings a shared journal shares with the team, by key: every option's scope, team unless it says otherwise."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def is_team(self, key: str) -> bool:
        return all(option.scope == OptionScope.TEAM for option in self.registry.options() if option.key == key)
