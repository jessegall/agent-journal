from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.skills_to_read import SkillsToRead
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.block_conditions.skills_read import SkillsRead


class SkillReadFirstRule(DriverRule):
    """While a skill is due the agent is blocked, and the refusal gives the path of the first one to read."""

    name = "skills.read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, to_read: SkillsToRead, files: SkillFiles, requirement: SkillRequirement) -> None:
        self.to_read, self.files, self.requirement = to_read, files, requirement

    def answer(self, hook: AgentHook) -> RuleAnswer:
        names = self.to_read.names(hook.agent_id)
        if not names or not self.requirement.is_required:
            return RuleAnswer.allowed()
        return RuleAnswer.blocked(hook, READ_SKILL_FIRST.nudge(path=self.files.relative(names[0])), SkillsRead())
