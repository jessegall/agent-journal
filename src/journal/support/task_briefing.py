from journal.models.task import Task
from journal.repositories.task_logs import TaskLogs

LAST = 3


class TaskBriefing:
    """What the agent is told of a task it takes up: its brief and its latest log lines, so it never works from the title alone."""

    def __init__(self, logs: TaskLogs) -> None:
        self.logs = logs

    def lines(self, task: Task) -> list[str]:
        logged = [log.line for log in self.logs.logs(task)][-LAST:]
        return ([f"brief: {task.brief}"] if task.brief else []) + [f"logged: {line}" for line in logged]

    def text(self, task: Task) -> str:
        return "; ".join(self.lines(task))
