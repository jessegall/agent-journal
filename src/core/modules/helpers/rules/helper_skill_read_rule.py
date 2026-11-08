from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
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
