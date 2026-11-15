from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from core.modules.questions.policies.own_question_tool_policy import OwnQuestionToolPolicy


class OwnQuestionToolRule(DriverRule):
    """The old walk's answer for OwnQuestionToolPolicy, which owns it, until the walk is deleted."""

    name = OwnQuestionToolPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "An agent that calls its program's own tool for asking the user is refused, and told to ask through the journal"

    def __init__(self, policy: OwnQuestionToolPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
