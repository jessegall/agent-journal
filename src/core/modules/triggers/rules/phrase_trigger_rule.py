from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from core.modules.skills.support.skill_block import SkillBlock
from core.modules.triggers.support.phrase_trigger_match import PHRASE_TRIGGER_KEY, PhraseTriggerMatch


class PhraseTriggerRule(DriverRule):
    """The old walk's answer for PhraseTriggerPolicy, PhraseTriggerLines, PhraseTriggerNeeds and PhraseTriggerEffect,
    which own it, until the walk is deleted."""

    name = PHRASE_TRIGGER_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PROMPT
    single_action_refusal = "A trigger whose words appear where it watches hands the agent its text or refuses"

    def __init__(self, match: PhraseTriggerMatch) -> None:
        self.match = match

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.match.answer(hook.event, hook.agent_id)
        if answer.refusal is not None:
            return RuleAnswer.refused(answer.refusal).running(*answer.commands)
        if answer.skill_block is not None:
            nudge, folder = answer.skill_block
            return SkillBlock.answer(hook, nudge, folder).running(*answer.commands)
        return RuleAnswer.with_nudges(*answer.nudges).running(*answer.commands)
