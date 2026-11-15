from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.command_category import CommandCategory
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.nudges.task_testing_question_nudge import TaskTestingQuestionNudge

TASK_START_COMMAND = ["task", "start"]


class OneInHandLines(EventLineSource):
    """An agent that starts a task with another still in hand is asked whether that one goes to testing first."""

    key = "tasks.start-with-one-in-hand"
    events = [HookEventName.PRE_TOOL_USE]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        tool = event.tool
        parts = tool.shell.parts if tool is not None and tool.shell is not None else ()
        starts = [list(part.arguments)[2:] for part in parts if part.classification.category is CommandCategory.JOURNAL and list(part.arguments[:2]) == TASK_START_COMMAND]
        if not starts:
            return []
        active_task_ids = [task.id for task in self.current_tasks.started_tasks(agent_id) if str(task.id) not in starts[0]]
        return [TaskTestingQuestionNudge.declared().nudge(task=active_task_ids[0])] if active_task_ids else []
