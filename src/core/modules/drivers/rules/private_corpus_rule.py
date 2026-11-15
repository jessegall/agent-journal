from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.policies.private_corpus_policy import PrivateCorpusPolicy


class PrivateCorpusRule(DriverRule):
    """The old walk's answer for PrivateCorpusPolicy, which owns it, until the walk is deleted."""

    name = PrivateCorpusPolicy.key
    overlay_proof = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "The private command corpus is never named by a shell line, whoever runs it"

    def __init__(self, policy: PrivateCorpusPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
