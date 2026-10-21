from journal.features.tasks.support.tasks_standing import TasksStanding
from journal.models.agent import Agent
from journal.models.open_task import OpenTask
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.entries import Entries
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks

LOOKED_BACK = 6
POLLED = 3
"""The same shell command this many times in a row, the one starting now among them, is polling."""


class TasksStandingReader:
    """Reads the tasks feature's part of the Standing for an agent."""

    def __init__(self, tasks: Tasks, plans: Plans, entries: Entries) -> None:
        self.tasks, self.plans, self.entries = tasks, plans, entries

    def read(self, agent: Agent) -> TasksStanding:
        in_hand = self.tasks.in_hand()
        parked, blocked_without_wait = self.tasks.in_state(TaskState.PARKED), self.tasks.blocked_without_wait()
        broken = [(task, check) for task, check in self.tasks.broken_waits()]
        commands = [e.data.get("tool_input", {}).get("command", "") for e in self.entries.tool_starts(agent.session, LOOKED_BACK) if e.data.get("tool_name") == "Bash"]
        free = self.plans.free()
        return TasksStanding(
            in_hand=in_hand.id if in_hand else 0,
            parked=tuple(t.id for t in parked),
            parked_named=self.named(parked),
            blocked=tuple(t.id for t in self.tasks.in_state(TaskState.BLOCKED)),
            blocked_without_wait=tuple(t.id for t in blocked_without_wait),
            blocked_without_wait_named=self.named(blocked_without_wait),
            broken_waits=tuple(t.id for t, check in broken),
            broken_waits_named="; ".join(f"task {task.id} waits on check {check.id}, {check.title}, which cannot run" for task, check in broken),
            first_parked_why=parked[0].parked_why if parked else "",
            next_open=OpenTask(free[0].id, free[0].title) if free else None,
            last_commands=tuple(commands[:POLLED]),
        )

    @staticmethod
    def named(tasks: list[Task]) -> str:
        return ", ".join(f"task {task.id} ({task.title})" for task in tasks)
