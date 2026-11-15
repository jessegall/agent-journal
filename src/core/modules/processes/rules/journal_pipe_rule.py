from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.journal_pipe_policy import JournalPipePolicy


class JournalPipeRule(DriverRule):
    """The old walk's answer for JournalPipePolicy, which owns it, until the walk is deleted."""

    name = JournalPipePolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Refuses a journal command piped into a program that cuts its output"

    def __init__(self, policy: JournalPipePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
