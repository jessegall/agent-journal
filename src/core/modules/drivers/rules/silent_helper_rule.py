from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers import EndSilentHelpers


class SilentHelperRule(DriverRule):
    """Each tick ends the helpers of the environment that have gone silent."""

    name = "drivers.silent-helper"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(EndSilentHelpers())
