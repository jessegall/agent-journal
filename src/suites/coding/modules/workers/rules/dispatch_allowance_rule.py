from suites.coding.modules.workers.support.worker_nudges import MAIN_WORKERS_REFUSED
from suites.coding.support.auto_advice import AutoAdvice
from engine.driver.agent_hook import AgentHook
from engine.enums.command_category import CommandCategory
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.setting.setting_values import SettingValues
from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING
from suites.coding.modules.workers.support.dispatch_arguments import DISPATCH_ARGUMENTS


class DispatchAllowanceRule(DriverRule):
    """The main agent dispatches no workers while the setting main-dispatches-workers is off."""

    name = "workers.dispatch-allowed"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "The main agent dispatches no workers while the setting main-dispatches-workers is off"

    def __init__(self, settings: SettingValues, guidance: AutoAdvice) -> None:
        self.settings, self.guidance = settings, guidance

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        dispatches = shell is not None and any(part.classification.category is CommandCategory.JOURNAL and part.arguments[:2] == DISPATCH_ARGUMENTS
                                               for part in shell.parts)
        if not dispatches or self.settings.value(DISPATCHES_WORKERS_SETTING) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(MAIN_WORKERS_REFUSED.nudge(then=self.guidance.without_workers()))
