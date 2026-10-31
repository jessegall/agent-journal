from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.drivers.suite_choice import SUITE_SETTING
from core.modules.drivers.suite_choose import SuiteChoose
from core.modules.settings.setting import Setting
from core.modules.settings.setting_store import SettingStore


class SuiteChooseHandler(Handler[SuiteChoose, Setting]):
    """Writes the environment's suite setting; the guard drivers.known-setting refuses a suite no module ships."""

    command = SuiteChoose

    def __init__(self, store: SettingStore) -> None:
        self.store = store

    def handle(self, command: SuiteChoose, context: Context) -> Setting:
        if context.environment_id is None:
            raise Refusal("a suite is chosen for an environment", "name one with --environment")
        return self.store.write(SUITE_SETTING, command.suite, context.environment_id, context)
