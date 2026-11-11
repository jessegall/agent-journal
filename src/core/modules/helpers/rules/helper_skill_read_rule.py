from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.helpers.support.helper_skill_reads import HelperSkillReads


class HelperSkillReadRule(DriverRule):
    """A read-only helper, which works in the main agent's checkout, reads only the skills its profile lists,
    and a read of the text of any other skill is refused."""

    name = "helpers.skill-read"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.HELPERS

    def __init__(self, reads: HelperSkillReads) -> None:
        self.reads = reads

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return self.reads.answer(hook)
