from engine.registry.driver_entry import DriverEntry
from engine.registry.registry import Registry
from engine.registry.suite_entry import SuiteEntry
from engine.agent.agent_policy import AgentPolicy
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.drivers.support.driver_settings import DRIVER_SETTINGS, SUITE_SETTING



class SuiteChoice:
    """Chooses an environment's suite from its setting, then shipped suites, then installed suites."""

    def __init__(self, registry: Registry, settings: SettingValues) -> None:
        self.registry, self.settings = registry, settings

    def suite(self) -> SuiteEntry | None:
        return self.suite_with_setting(self.settings.text(SUITE_SETTING))

    def suite_name(self, setting: str) -> str:
        suite = self.suite_with_setting(setting)
        return suite.name if suite is not None else ""

    def suite_with_setting(self, setting: str) -> SuiteEntry | None:
        configured_suite = self.registry.suite(setting)
        if configured_suite is not None:
            return configured_suite
        tops = self.registry.default_suite_roots()
        if not tops:
            tops = self.registry.top_suites()
        return tops[0] if len(tops) == 1 else None

    def runs(self, suite_name: str) -> bool:
        suite = self.suite()
        return suite is not None and suite_name in self.registry.ancestors(suite)

    def agent_policy(self) -> AgentPolicy:
        suite = self.suite()
        return suite.agent_policy if suite is not None else AgentPolicy()

    def driver(self, role: str) -> DriverEntry | None:
        suite = self.suite()
        if suite is None:
            return None
        configured_driver = self.registry.driver(self.settings.text(f"{DRIVER_SETTINGS}{role}"))
        if configured_driver is not None:
            return configured_driver
        return self.registry.driver(suite.defaults.get(role, ""))

    def suite_names(self) -> str:
        return " or ".join(sorted(suite.name for suite in self.registry.suites))
