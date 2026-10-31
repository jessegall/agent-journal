from core.base.actor_type import ActorType
import json

from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.drivers.setting_essential_allowances import ALLOWANCE_SETTINGS
from core.modules.drivers.suite_choice import SUITE_SETTING, SuiteChoice
from core.modules.settings.setting import Setting

DRIVER_SETTINGS = "drivers."


class DriverSettingGuard(Guard):
    """Refuses a suite setting naming a suite no installed module ships, and a driver setting naming a driver that is
    not installed or belongs to a suite the environment does not run."""

    name = "drivers.known-setting"
    event = "setting.*"

    def __init__(self, registry: Registry, choice: SuiteChoice) -> None:
        self.registry, self.choice = registry, choice

    def check(self, change: Change[Model]) -> None:
        setting = change.row
        if not isinstance(setting, Setting) or not setting.key.startswith(DRIVER_SETTINGS) or change.event.endswith(".delete"):
            return
        if setting.key.startswith(ALLOWANCE_SETTINGS):
            if change.context.actor.type is ActorType.AGENT:
                raise Refusal("only a person allows a rule to be essential", "ask the user to run journal driver allow-essential")
            return
        value = json.loads(setting.value)
        if setting.key == SUITE_SETTING:
            if self.registry.suite(value) is None:
                raise Refusal(f"no installed module ships suite {value}: {self.choice.suite_names()}", "journal suite show <name> describes one")
            return
        self.check_driver(value, setting.environment_id)

    def check_driver(self, value: str, environment_id: int | None) -> None:
        driver = self.registry.driver(value)
        if driver is None:
            raise Refusal(f"no installed module ships driver {value}", "journal suite show <name> lists a suite's drivers")
        suite = self.choice.suite(environment_id) if environment_id is not None else None
        if suite is None or driver not in self.registry.suite_drivers(suite):
            suite_name = suite.name if suite is not None else "no suite"
            raise Refusal(f"driver {driver.name} belongs to suite {driver.suite}, and this environment runs {suite_name}", f"journal suite choose {driver.suite}")
