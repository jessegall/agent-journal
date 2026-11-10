from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from suites.coding.support.coding_nudges import INTRODUCTION_NUDGE


class IntroductionRule(DriverRule):
    """A main session the journal started, from its launcher, is told to introduce itself in the chat."""

    name = "coding.introduction"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["coding.*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.launch:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(INTRODUCTION_NUDGE.nudge())
