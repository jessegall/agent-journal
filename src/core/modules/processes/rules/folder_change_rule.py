from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.folder_change_policy import FolderChangePolicy


class FolderChangeRule(DriverRule):
    """The old walk's answer for FolderChangePolicy, which owns it, until the walk is deleted."""

    name = FolderChangePolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "An agent does not move to another folder with cd"

    def __init__(self, policy: FolderChangePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
