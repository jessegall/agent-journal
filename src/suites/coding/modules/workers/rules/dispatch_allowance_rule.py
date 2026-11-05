from suites.coding.modules.workers.support.worker_nudges import BUILDER_BUILDS
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING
from suites.coding.modules.workers.support.dispatch_arguments import DISPATCH_ARGUMENTS


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
        if not dispatches or self.settings.value(DISPATCHES_WORKERS_SETTING) is not False:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(BUILDER_BUILDS.nudge())
