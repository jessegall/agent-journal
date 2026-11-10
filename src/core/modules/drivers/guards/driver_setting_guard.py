import json

from core.base.change.created import Created
from core.base.change.updated import Updated
from core.base.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.drivers.support.driver_settings import ALLOWANCE_SETTINGS, DRIVER_SETTINGS, MODULE_KEY, SUITE_SETTING
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.models.setting import Setting



class DriverSettingGuard(Guard[Created[Setting] | Updated[Setting]]):
    """Refuses a suite setting naming a suite no installed module ships, and a driver setting naming a driver
    that is not installed or belongs to a suite the environment does not run."""

    name = "drivers.known-setting"

    def __init__(self, registry: Registry, choice: SuiteChoice) -> None:
        self.registry, self.choice = registry, choice

    def check(self, event: Created[Setting] | Updated[Setting], context: Context) -> None:
        setting = event.row
        if not setting.key.startswith(f"{MODULE_KEY}."):
            return
        if setting.key.startswith(ALLOWANCE_SETTINGS):
            return
        value = json.loads(setting.value)
        if setting.key == SUITE_SETTING:
            if self.registry.suite(value) is None:
                raise Refusal(f"no installed module ships suite {value}: {self.choice.suite_names()}", "journal suite show <name> describes one")
            return
        if setting.key.startswith(DRIVER_SETTINGS):
            self.check_driver(value, setting.environment_id)

    def check_driver(self, value: str, environment_id: int | None) -> None:
        driver = self.registry.driver(value)
        if driver is None:
            raise Refusal(f"no installed module ships driver {value}", "journal suite show <name> lists a suite's drivers")
        suite = self.choice.suite() if environment_id is not None else None
        if suite is None or driver not in self.registry.suite_drivers(suite):
            suite_name = suite.name if suite is not None else "no suite"
            raise Refusal(f"driver {driver.name} belongs to suite {driver.suite}, and this environment runs {suite_name}", f"journal suite choose {driver.suite}")
