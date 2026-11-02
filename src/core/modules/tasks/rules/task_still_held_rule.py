from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_nudges import TASK_STILL_HELD

LEAVING_LINES = ("journal task close ", "journal task cancel ", "journal task block ", "journal task release ")


class TaskStillHeldRule(DriverRule):
    """An agent that lets go of a task while it holds others is sent back to the one it started last."""

    name = "tasks.still-held"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        command = str(hook.event.tool_input().get("command", ""))
        if not any(line in command for line in LEAVING_LINES):
            return RuleAnswer.allowed()
        current = self.current_tasks.current(hook.agent_id)
        return RuleAnswer.with_nudges(TASK_STILL_HELD.nudge(name=current.name)) if current is not None else RuleAnswer.allowed()
