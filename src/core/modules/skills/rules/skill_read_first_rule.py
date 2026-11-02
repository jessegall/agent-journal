from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.due_skills import DueSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.block_conditions.skills_read import SkillsRead


class SkillReadFirstRule(DriverRule):
    """While a skill is due the agent is blocked, and the refusal gives the path of the first one to read."""

    name = "skills.read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, due: DueSkills, files: SkillFiles) -> None:
        self.due, self.files = due, files

    def answer(self, hook: AgentHook) -> RuleAnswer:
        folders = self.due.folders(hook.agent_id)
        if not folders:
            return RuleAnswer.allowed()
        return RuleAnswer.blocked(hook, READ_SKILL_FIRST.nudge(path=self.files.relative(folders[0])), SkillsRead())
