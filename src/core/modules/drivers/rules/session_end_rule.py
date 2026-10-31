from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.agents.commands.end_agent import EndAgent


class SessionEndRule(DriverRule):
    """A session that ends ends its agent, so it names no caller any more."""

    name = "drivers.session-end"
    hook = HookEventName.SESSION_END
    drivers = ["*"]
    essential = True

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(EndAgent(hook.agent_id))
