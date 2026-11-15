from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.reading_policy import READING_KEY
from core.modules.processes.support.reading.reading_enforcer import ReadingEnforcer


class ReadingRule(DriverRule):
    """The old walk's answer for ReadingPolicy and ReadingLines, which own it, until the walk is deleted."""

    name = READING_KEY
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A command that ran without a good reader is refused its next start until a reader or a reason is given"

    def __init__(self, enforcer: ReadingEnforcer) -> None:
        self.enforcer = enforcer

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.enforcer.answer(hook.event)
        if answer.refusal is not None:
            return RuleAnswer(refusal=answer.refusal.text, nudges=(answer.refusal, *answer.nudges), last=True)
        return RuleAnswer.with_nudges(*answer.nudges)
