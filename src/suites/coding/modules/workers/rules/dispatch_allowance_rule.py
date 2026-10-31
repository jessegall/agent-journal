from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.agent_role import AgentRole

DISPATCHES_WORKERS_SETTING = "coding.builder-dispatches-workers"
DISPATCH_ARGUMENTS = ("worker", "dispatch")


class DispatchAllowanceRule(DriverRule):
    """A builder dispatches no workers while the setting coding.builder-dispatches-workers is false."""

    name = "workers.dispatch-allowed"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.builder"]
    roles = [AgentRole.MAIN]

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        dispatches = shell is not None and any(part.classification.category is CommandCategory.JOURNAL and part.arguments[:2] == DISPATCH_ARGUMENTS
                                               for part in shell.parts)
        if not dispatches or self.settings.value(DISPATCHES_WORKERS_SETTING, hook.environment_id, True) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused("this builder builds its tasks itself: coding.builder-dispatches-workers is false")
