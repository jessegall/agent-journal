from journal.features.tasks.support.tasks_snapshot import TasksSnapshot
from journal.models.agent import Agent
from journal.models.open_task import OpenTask
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.entries import Entries
from journal.repositories.plans import Plans
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks

LOOKED_BACK = 6
POLLED = 3
"""The same shell command this many times in a row, the one starting now among them, is polling."""


class TasksSnapshotReader:
    """Reads the tasks feature's part of the Snapshot for an agent."""

    def __init__(self, tasks: Tasks, plans: Plans, entries: Entries, logs: TaskLogs) -> None:
        self.tasks, self.plans, self.entries, self.logs = tasks, plans, entries, logs

    def read(self, agent: Agent) -> TasksSnapshot:
        in_hand = self.tasks.in_hand()
        parked, blocked_without_wait = self.tasks.in_state(TaskState.PARKED), self.tasks.blocked_without_wait()
        broken = [(task, check) for task, check in self.tasks.broken_waits()]
        commands = [e.data.get("tool_input", {}).get("command", "") for e in self.entries.tool_starts(agent.session, LOOKED_BACK) if e.data.get("tool_name") == "Bash"]
        free = self.plans.free()
        return TasksSnapshot(
            in_hand=in_hand.id if in_hand else 0,
            last_log_line=self.last_log(in_hand) if in_hand else "",
            parked=tuple(t.id for t in parked),
            parked_summary=", ".join(f"task {task.id} ({task.title}), parked because: {task.parked_why}" for task in parked),
            blocked=tuple(t.id for t in self.tasks.in_state(TaskState.BLOCKED)),
            blocked_without_wait=tuple(t.id for t in blocked_without_wait),
            blocked_without_wait_summary=self.summary(blocked_without_wait),
            broken_waits=tuple(t.id for t, check in broken),
            broken_waits_summary="; ".join(f"task {task.id} waits on check {check.id}, {check.title}, which cannot run" for task, check in broken),
            first_parked_why=parked[0].parked_why if parked else "",
            next_open=OpenTask(free[0].id, free[0].title, free[0].brief, 0) if free else None,
            last_commands=tuple(commands[:POLLED]),
        )

    def last_log(self, task: Task) -> str:
        logs = self.logs.of(task)
        return f'"{logs[-1].line}"' if logs else "nothing logged yet"

    @staticmethod
    def summary(tasks: list[Task]) -> str:
        return ", ".join(f"task {task.id} ({task.title})" for task in tasks)
