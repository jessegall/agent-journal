from journal.models.task import Task
from journal.repositories.task_logs import TaskLogs

RECENT_LOG_LINES = 3


class TaskBriefing:
    """What the agent is told of a task: its brief and its latest log lines when it takes the task up, so it never works from the title alone, and the brief and every log line in order when it reads the task whole."""

    def __init__(self, logs: TaskLogs) -> None:
        self.logs = logs

    def lines(self, task: Task) -> list[str]:
        logged = [log.line for log in self.logs.logs(task)][-RECENT_LOG_LINES:]
        return ([f"brief: {task.brief}"] if task.brief else []) + [f"logged: {line}" for line in logged]

    def whole(self, task: Task) -> str:
        logged = sorted(self.logs.logs(task), key=lambda log: log.row_id)
        entries = "\n".join(f"  {log.created_at:%Y-%m-%d %H:%M}  {log.line}" for log in logged)
        return f"brief: {task.brief or 'none'}\n" + (f"log ({len(logged)} lines):\n{entries}" if logged else "log: none")

    def text(self, task: Task) -> str:
        return "; ".join(self.lines(task))
