from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.needs.unlogged_write_needs import UNLOGGED_WRITE_KEY, UnloggedWriteNeeds


class UnloggedWriteRule(DriverRule):
    """The old walk's answer for UnloggedWriteNeeds, which owns it, until the walk is deleted."""

    name = UNLOGGED_WRITE_KEY
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.TASK

    def __init__(self, needs: UnloggedWriteNeeds) -> None:
        self.needs = needs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        hold = self.needs.hold(hook.event, hook.agent_id)
        return RuleAnswer.blocked(hook, *hold) if hold is not None else RuleAnswer.allowed()
