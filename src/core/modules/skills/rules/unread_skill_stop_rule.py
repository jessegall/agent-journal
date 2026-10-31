from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.due_skills import DueSkills


class UnreadSkillStopRule(DriverRule):
    """A stop while a skill is due is refused, naming the unread skills."""

    name = "skills.unread-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, due: DueSkills) -> None:
        self.due = due

    def answer(self, hook: AgentHook) -> RuleAnswer:
        folders = self.due.folders(hook.agent_id)
        return RuleAnswer.refused(f"unread skills: {', '.join(folders)}") if folders else RuleAnswer.allowed()
