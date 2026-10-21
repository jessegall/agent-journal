from journal.http.plans.timeline_moment import TimelineMoment
from journal.models.plan import Plan
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.repositories.task_logs import TaskLogs


class PlanTimeline:
    """What happened on a plan's tasks, oldest first: each start, each log line, and each end, done or given up."""

    def __init__(self, plans: Plans, task_logs: TaskLogs) -> None:
        self.plans, self.task_logs = plans, task_logs

    def of(self, plan: Plan) -> list[TimelineMoment]:
        moments = [moment for task in self.plans.tasks_of(plan) for moment in self.moments(task)]
        return sorted(moments, key=lambda m: m.time)

    def moments(self, task: Task) -> list[TimelineMoment]:
        rows = [TimelineMoment(log.created_at.timestamp(), "log", task.id, task.title, log.line) for log in self.task_logs.of(task)]
        if task.started_at:
            rows.append(TimelineMoment(task.started_at.timestamp(), "started", task.id, task.title, ""))
        if task.finished_at:
            rows.append(TimelineMoment(task.finished_at.timestamp(), "done" if task.state == TaskState.DONE else "ended", task.id, task.title, task.outcome))
        return rows
