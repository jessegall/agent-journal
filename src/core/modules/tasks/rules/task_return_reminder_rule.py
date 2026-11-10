from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_nudges import TASK_RETURN_REMINDER

LEAVING_COMMANDS = ("task close", "task cancel", "task block", "task release")


class TaskReturnReminderRule(DriverRule):
    """An agent that lets go of a task while it holds others is sent back to the one it started last."""

    name = "tasks.still-held"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not shell.parts_running_journal_command(*LEAVING_COMMANDS):
            return RuleAnswer.allowed()
        current = self.current_tasks.current(hook.agent_id)
        return RuleAnswer.with_nudges(TASK_RETURN_REMINDER.nudge(task=current.task.id)) if current is not None else RuleAnswer.allowed()
