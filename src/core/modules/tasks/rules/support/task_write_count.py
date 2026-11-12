from engine.driver.agent_hook import AgentHook
from engine.database.kept_rows import KeptRows
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.tasks.rules.support.current_task import CurrentTask
from core.modules.tasks.rules.support.current_tasks import CurrentTasks


class TaskWriteCount:
    """For a hook that writes files while its agent holds a task: the task, and how many writes this one
    makes since the task was last logged."""

    def __init__(self, current_tasks: CurrentTasks, calls: HookCallQuery, kept: KeptRows) -> None:
        self.current_tasks, self.calls = current_tasks, calls
        self.kept = kept

    def count(self, hook: AgentHook) -> tuple[CurrentTask, int] | None:
        tool = hook.event.tool
        current = self.current_tasks.current(hook.agent_id) if tool is not None and tool.is_writing_files() else None
        if current is None:
            return None
        writes = self.calls.writes_since(hook.agent_id, current.count_start)
        count = self.kept.read(writes, writes.count, name="tasks.write_count")
        return current, count + 1
