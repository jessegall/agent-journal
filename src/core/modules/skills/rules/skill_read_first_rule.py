from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded


class SkillReadFirstRule(DriverRule):
    """While a skill is due the agent is blocked until it has read that skill, and the next one due blocks it anew,
    so the refusal always names one that is due, by a path a worker's worktree can read too."""

    name = "skills.read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, unread_skills: UnreadSkills, files: SkillFiles, requirement: SkillRequirement) -> None:
        self.unread_skills, self.files, self.requirement = unread_skills, files, requirement

    def answer(self, hook: AgentHook) -> RuleAnswer:
        names = self.unread_skills.names(hook.agent_id)
        if not names or not self.requirement.is_required:
            return RuleAnswer.allowed()
        path = self.files.path(names[0], hook)
        return RuleAnswer.blocked(hook, READ_SKILL_FIRST.nudge(path=path), SkillLoaded(names[0]))
