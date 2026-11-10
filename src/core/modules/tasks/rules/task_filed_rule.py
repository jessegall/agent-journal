from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_nudges import TASK_FILED, TASK_FILED_KEEP_CURRENT

TASK_COMMAND_START = ["task", "make"]


class TaskFiledRule(DriverRule):
    """After an agent makes a task it is told to leave it open: the task is started by whoever the suite an
    environment runs has hand out tasks, if it has one."""

    name = "tasks.filed"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        parts = tool.shell.parts if tool is not None and tool.shell is not None else ()
        if not any(part.classification.category is CommandCategory.JOURNAL and list(part.arguments[:2]) == TASK_COMMAND_START for part in parts):
            return RuleAnswer.allowed()
        current = self.current_tasks.current(hook.agent_id)
        return RuleAnswer.with_nudges(TASK_FILED_KEEP_CURRENT.nudge(task=current.task.id) if current is not None else TASK_FILED.nudge())
