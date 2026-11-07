from core.modules.skills.support.skill_nudges import UNREAD_SKILLS
from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.skills.support.skill_requirement import SkillRequirement


class UnreadSkillStopRule(DriverRule):
    """A stop while a skill is due is refused, naming the unread skills."""

    name = "skills.unread-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, unread_skills: UnreadSkills, requirement: SkillRequirement) -> None:
        self.unread_skills, self.requirement = unread_skills, requirement

    def answer(self, hook: AgentHook) -> RuleAnswer:
        names = self.unread_skills.names(hook.agent_id)
        return RuleAnswer.refused(UNREAD_SKILLS.nudge(skills=', '.join(names))) if names and self.requirement.is_required else RuleAnswer.allowed("no required skill is unread")
