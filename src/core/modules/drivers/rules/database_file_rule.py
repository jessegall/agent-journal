from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.policies.database_file_policy import DatabaseFilePolicy


class DatabaseFileRule(DriverRule):
    """The old walk's answer for DatabaseFilePolicy, which owns it, until the walk is deleted."""

    name = DatabaseFilePolicy.key
    overlay_proof = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "No agent writes the journal's database file by hand"

    def __init__(self, policy: DatabaseFilePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
