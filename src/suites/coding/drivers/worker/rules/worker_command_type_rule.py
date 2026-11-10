from collections.abc import Sequence

from suites.coding.support.coding_nudges import WORKER_COMMAND_TYPE
from engine.driver.agent_hook import AgentHook
from core.modules.drivers.rules.allowed_command_types_rule import AllowedCommandTypesRule
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.support.coding_settings import COMMAND_TYPES



class WorkerCommandTypeRule(AllowedCommandTypesRule):
    """A worker runs journal commands and only the command types the setting workers.command-types lists."""

    name = "workers.allowed-command-types"
    refusal = WORKER_COMMAND_TYPE

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def command_types(self, hook: AgentHook) -> Sequence[str]:
        return self.settings.texts(COMMAND_TYPES)
