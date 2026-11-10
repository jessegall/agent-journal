from engine.enums.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_nudges import TASK_TESTING_QUESTION

TASK_START_COMMAND = ["task", "start"]


class TaskStartRule(DriverRule):
    """An agent that starts a task with another still in hand is asked whether that one goes to testing first."""

    name = "tasks.start-with-one-in-hand"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.TASK

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        parts = tool.shell.parts if tool is not None and tool.shell is not None else ()
        starts = [list(part.arguments)[2:] for part in parts if part.classification.category is CommandCategory.JOURNAL and list(part.arguments[:2]) == TASK_START_COMMAND]
        if not starts:
            return RuleAnswer.allowed()
        active_task_ids = [task.id for task in self.current_tasks.started_tasks(hook.agent_id) if str(task.id) not in starts[0]]
        return RuleAnswer.with_nudges(TASK_TESTING_QUESTION.nudge(task=active_task_ids[0])) if active_task_ids else RuleAnswer.allowed()
