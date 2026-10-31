from core.base.registry.driver_entry import DriverEntry
from core.base.registry.registry import Registry
from core.base.registry.suite_entry import SuiteEntry
from core.modules.settings.bindings.support.setting_values import SettingValues

SUITE_SETTING = "drivers.suite"


class SuiteChoice:
    """The suite an environment runs and the driver each role gets there: what the environment's settings name,
    else the one installed suite no other requires and that suite's default for the role."""

    def __init__(self, registry: Registry, settings: SettingValues) -> None:
        self.registry, self.settings = registry, settings

    def suite(self, environment_id: int) -> SuiteEntry | None:
        value = self.settings.text(SUITE_SETTING, environment_id, "")
        if value:
            return self.registry.suite(value)
        tops = self.registry.top_suites()
        return tops[0] if len(tops) == 1 else None

    def driver(self, environment_id: int, role: str) -> DriverEntry | None:
        suite = self.suite(environment_id)
        if suite is None:
            return None
        value = self.settings.text(f"drivers.{role}", environment_id, suite.defaults.get(role, ""))
        return self.registry.driver(value)

    def suite_names(self) -> str:
        return " or ".join(sorted(suite.name for suite in self.registry.suites))
