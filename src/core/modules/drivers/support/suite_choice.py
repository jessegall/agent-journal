from core.base.registry.driver_entry import DriverEntry
from core.base.registry.registry import Registry
from core.base.registry.suite_entry import SuiteEntry
from core.base.agent_policy import AgentPolicy
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.drivers.support.driver_settings import DRIVER_SETTINGS, SUITE_SETTING



class SuiteChoice:
    """Chooses an environment's suite from its setting, then shipped suites, then installed suites."""

    def __init__(self, registry: Registry, settings: SettingValues) -> None:
        self.registry, self.settings = registry, settings

    def suite(self, environment_id: int) -> SuiteEntry | None:
        configured_suite = self.registry.suite(self.settings.text(SUITE_SETTING, environment_id))
        if configured_suite is not None:
            return configured_suite
        tops = self.registry.default_suite_roots()
        if not tops:
            tops = self.registry.top_suites()
        return tops[0] if len(tops) == 1 else None

    # Whether the environment runs the suite of that name, as the suite it chose or one that requires it, however far down.
    def runs(self, environment_id: int, suite_name: str) -> bool:
        suite = self.suite(environment_id)
        return suite is not None and suite_name in self.registry.lineage(suite)

    def agent_policy(self, environment_id: int) -> AgentPolicy:
        suite = self.suite(environment_id)
        return suite.agent_policy if suite is not None else AgentPolicy()

    def driver(self, environment_id: int, role: str) -> DriverEntry | None:
        suite = self.suite(environment_id)
        if suite is None:
            return None
        configured_driver = self.registry.driver(self.settings.text(f"{DRIVER_SETTINGS}{role}", environment_id))
        if configured_driver is not None:
            return configured_driver
        return self.registry.driver(suite.defaults.get(role, ""))

    def suite_names(self) -> str:
        return " or ".join(sorted(suite.name for suite in self.registry.suites))
