from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST

from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.kept_skills import KeptSkills
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded


class SkillReadFirstRule(DriverRule):
    """Refuses a tool until its required skills have been read; a skill the program put back after a compaction
    counts as read."""

    name = "skills.read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, unread_skills: UnreadSkills, files: SkillFiles, requirement: SkillRequirement, kept: KeptSkills) -> None:
        self.unread_skills, self.files, self.requirement, self.kept = unread_skills, files, requirement, kept

    def answer(self, hook: AgentHook) -> RuleAnswer:
        names = self.unread_skills.names(hook.agent_id)
        if not names:
            return RuleAnswer.allowed()
        loads = self.kept.loads(hook, names)
        kept_names = {load.skill for load in loads}
        still_due = [name for name in names if name not in kept_names]
        if not still_due or not self.requirement.is_required:
            return RuleAnswer.allowed().running(*loads)
        instruction = self.files.instruction(still_due[0], hook)
        return RuleAnswer.blocked(hook, READ_SKILL_FIRST.nudge(instruction=instruction), SkillLoaded(still_due[0])).running(*loads)
