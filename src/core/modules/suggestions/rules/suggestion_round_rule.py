from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.suggestions.commands.make_suggestions import MakeSuggestions


class SuggestionRoundRule(DriverRule):
    """On the main agent's tick, offers each suggestion that applies and was never offered."""

    name = "suggestions.round"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(MakeSuggestions())
