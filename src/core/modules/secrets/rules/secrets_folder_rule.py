from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.secrets.policies.secrets_folder_policy import SecretsFolderPolicy


class SecretsFolderRule(DriverRule):
    """The old walk's answer for SecretsFolderPolicy, which owns it, until the walk is deleted."""

    name = SecretsFolderPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    essential = True
    single_action_refusal = "A tool that names the secrets folder, or version 4's folder of server keys, by any spelling of its path"

    def __init__(self, policy: SecretsFolderPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
