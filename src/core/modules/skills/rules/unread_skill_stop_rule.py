from core.modules.skills.support.skill_nudges import UNREAD_SKILLS
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.skills_to_read import SkillsToRead
from core.modules.skills.support.skill_requirement import SkillRequirement


class UnreadSkillStopRule(DriverRule):
    """A stop while a skill is due is refused, naming the unread skills."""

    name = "skills.unread-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, to_read: SkillsToRead, requirement: SkillRequirement) -> None:
        self.to_read, self.requirement = to_read, requirement

    def answer(self, hook: AgentHook) -> RuleAnswer:
        names = self.to_read.names(hook.agent_id)
        return RuleAnswer.refused(UNREAD_SKILLS.nudge(skills=', '.join(names))) if names and self.requirement.is_required else RuleAnswer.allowed()
