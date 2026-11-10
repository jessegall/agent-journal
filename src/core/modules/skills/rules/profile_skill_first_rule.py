from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.enums.role_group import RoleGroup
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.unread_skills import UnreadSkills


class ProfileSkillFirstRule(DriverRule):
    """Refuses a read-only helper's tools, apart from reads and journal commands, until it has read the skills its
    profile requires. Agents of the roles that take start skills are held by the read-first rule instead."""

    name = "skills.profile-read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.HELPERS

    def __init__(self, unread_skills: UnreadSkills, profile_skills: AgentProfileSkills, files: SkillFiles, requirement: SkillRequirement) -> None:
        self.unread_skills, self.profile_skills, self.files, self.requirement = unread_skills, profile_skills, files, requirement

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.block_exempt or not self.requirement.is_required:
            return RuleAnswer.allowed()
        required = self.profile_skills.required(hook.agent_id)
        unread = [folder for folder in self.unread_skills.names(hook.agent_id) if folder in required]
        return RuleAnswer.refused(READ_SKILL_FIRST.nudge(instruction=self.files.instruction(unread[0], hook))) if unread else RuleAnswer.allowed()
