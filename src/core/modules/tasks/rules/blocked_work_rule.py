from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.lines.blocked_work_lines import BlockedWorkLines


class BlockedWorkRule(DriverRule):
    """The old walk's answer for BlockedWorkLines, which owns it: the walk refuses the stop once to name the blocked
    tasks, until the walk is deleted."""

    name = BlockedWorkLines.key
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "A stop with nothing in hand while tasks are blocked is refused once, to name them"

    def __init__(self, lines: BlockedWorkLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudges[0]) if nudges else RuleAnswer.allowed()
