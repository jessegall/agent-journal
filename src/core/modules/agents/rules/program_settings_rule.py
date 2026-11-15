from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.agents.policies.program_settings_policy import ProgramSettingsPolicy


class ProgramSettingsRule(DriverRule):
    """The old walk's answer for ProgramSettingsPolicy, which owns it, until the walk is deleted."""

    name = ProgramSettingsPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    exempt = True
    essential = True
    single_action_refusal = "A write to the journal's own Claude Code or Codex settings is refused"

    def __init__(self, policy: ProgramSettingsPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
