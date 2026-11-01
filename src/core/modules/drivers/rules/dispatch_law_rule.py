from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.modules.drivers.support.driver_nudges import MISSING_MODEL, UNBOUND_DISPATCH

FORK_AGENT = "fork"


class DispatchLawRule(DriverRule):
    """A subagent dispatch names its model and is bound to a concrete job, a description and a prompt; a fork inherits its model by what it is."""

    name = "drivers.dispatch-law"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.AGENT:
            return RuleAnswer.allowed()
        dispatch = hook.event.tool_input()
        if not dispatch.get("description") or not dispatch.get("prompt"):
            return RuleAnswer.refused(UNBOUND_DISPATCH.nudge())
        if not dispatch.get("model") and dispatch.get("subagent_type") != FORK_AGENT:
            return RuleAnswer.refused(MISSING_MODEL.nudge())
        return RuleAnswer.allowed()
