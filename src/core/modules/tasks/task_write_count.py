from core.base.driver.agent_hook import AgentHook
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.tasks.current_task import CurrentTask
from core.modules.tasks.current_tasks import CurrentTasks


class TaskWriteCount:
    """For a hook that writes files while its agent holds a task: the task, and how many writes this one makes since
    the task was last logged."""

    def __init__(self, current_tasks: CurrentTasks, calls: HookCallQuery) -> None:
        self.current_tasks, self.calls = current_tasks, calls

    def count(self, hook: AgentHook) -> tuple[CurrentTask, int] | None:
        tool = hook.event.tool
        current = self.current_tasks.current(hook.agent_id) if tool is not None and tool.is_writing_files() else None
        return (current, self.calls.writes_since(hook.agent_id, current.counted_from) + 1) if current is not None else None
