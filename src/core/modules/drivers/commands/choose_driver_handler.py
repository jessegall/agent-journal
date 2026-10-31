from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.drivers.commands.choose_driver import ChooseDriver
from core.modules.settings.models.setting import Setting
from core.modules.settings.commands.support.setting_store import SettingStore
from core.modules.drivers.support.driver_settings import DRIVER_SETTINGS


class ChooseDriverHandler(Handler[ChooseDriver, Setting]):
    """Writes the environment's driver setting for the driver's role; the guard drivers.known-setting refuses a
    driver that is not installed or not of the suite the environment runs."""

    command = ChooseDriver

    def __init__(self, registry: Registry, store: SettingStore) -> None:
        self.registry, self.store = registry, store

    def handle(self, command: ChooseDriver, context: Context) -> Setting:
        if context.environment_id is None:
            raise Refusal("a driver is chosen for an environment", "name one with --environment")
        driver = self.registry.driver(command.driver)
        if driver is None:
            raise Refusal(f"no installed module ships driver {command.driver}", "journal suite show <name> lists a suite's drivers")
        return self.store.write(f"{DRIVER_SETTINGS}{driver.role}", driver.name, context.environment_id, context)
