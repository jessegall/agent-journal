from journal.features.tasks.support.tasks_data import TasksData
from journal.models.agent import Agent
from journal.models.open_task import OpenTask
from journal.models.task import Task
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.repositories.entries import Entries
from journal.repositories.plans import Plans
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers

HISTORY_TOOL_STARTS = 6
POLL_COMMANDS = 3


class TasksDataReader:
    """Reads the tasks feature's part of the feature data for an agent."""

    def __init__(self, tasks: Tasks, plans: Plans, entries: Entries, logs: TaskLogs, workers: Workers) -> None:
        self.tasks, self.plans, self.entries, self.logs, self.workers = tasks, plans, entries, logs, workers

    def read(self, agent: Agent) -> TasksData:
        current_task = self.tasks.current(agent)
        suspended_tasks = [task for task in self.tasks.with_state(TaskState.SUSPENDED) if PlanState.SUSPENDED not in self.plans.plan_states(task)]
        blocked_without_wait = self.tasks.blocked_without_wait()
        broken = [(task, check) for task, check in self.tasks.broken_waits()]
        commands = [command for e in self.entries.tool_starts(agent.session, HISTORY_TOOL_STARTS) if (command := e.recorded_call().command)]
        free = self.plans.free()
        open_tasks = self.tasks.open_tasks()
        return TasksData(
            current_task=current_task.row_id if current_task else 0,
            last_log_line=self.last_log(current_task) if current_task else "",
            suspended=tuple(t.row_id for t in suspended_tasks),
            suspension_summary=", ".join(f"task {task.id} ({task.title}), parked because: {task.suspension_reason}" for task in suspended_tasks),
            blocked=tuple(t.row_id for t in self.tasks.blocked_tasks()),
            blocked_without_wait=tuple(t.row_id for t in blocked_without_wait),
            blocked_without_wait_summary=self.summary(blocked_without_wait),
            broken_waits=tuple(t.row_id for t, check in broken),
            broken_waits_summary="; ".join(f"task {task.id} waits on check {check.id}, {check.title}, which cannot run" for task, check in broken),
            first_suspension_reason=suspended_tasks[0].suspension_reason if suspended_tasks else "",
            next_open=OpenTask(free[0].row_id, free[0].title, free[0].brief, 0) if free else None,
            last_commands=tuple(commands[:POLL_COMMANDS]),
            open_ids=tuple(t.row_id for t in open_tasks),
            open_summary=self.summary(open_tasks),
            started_ids=tuple(t.row_id for t in self.tasks.with_state(TaskState.STARTED)),
            agent_tasks=self.tasks.holder_task_ids(self.workers.agent_holder(agent)),
        )

    def last_log(self, task: Task) -> str:
        logs = self.logs.logs(task)
        return f'"{logs[-1].line}"' if logs else "nothing logged yet"

    @staticmethod
    def summary(tasks: list[Task]) -> str:
        return ", ".join(f"task {task.id} ({task.title})" for task in tasks)
