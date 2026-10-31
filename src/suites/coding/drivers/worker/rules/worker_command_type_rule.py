from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues

COMMAND_TYPES = "workers.command-types"
DEFAULT_COMMAND_TYPES = (CommandCategory.READ.value, CommandCategory.SEARCH.value, CommandCategory.EDIT.value, CommandCategory.TEST_RUN.value,
                         CommandCategory.BUILD.value)


class WorkerCommandTypeRule(DriverRule):
    """A worker runs journal commands and only the command types the setting workers.command-types lists."""

    name = "workers.allowed-command-types"
    hook = HookEventName.PRE_TOOL_USE

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        allowed = self.settings.texts(COMMAND_TYPES, hook.environment_id, DEFAULT_COMMAND_TYPES)
        refused = next((part for part in shell.parts if part.classification.category is not CommandCategory.JOURNAL
                        and part.classification.category.value not in allowed), None) if shell is not None else None
        if refused is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"a worker here runs no {refused.classification.category.value} command: {refused.text}")
