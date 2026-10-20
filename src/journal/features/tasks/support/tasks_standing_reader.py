from journal.features.tasks.support.tasks_standing import TasksStanding
from journal.models.agent import Agent
from journal.models.task_state import TaskState
from journal.repositories.tasks import Tasks


class TasksStandingReader:
    """Reads the tasks feature's part of the Standing for an agent."""

    def __init__(self, tasks: Tasks) -> None:
        self.tasks = tasks

    def read(self, agent: Agent) -> TasksStanding:
        in_hand = self.tasks.in_hand()
        return TasksStanding(in_hand=in_hand.id if in_hand else 0, parked=tuple(t.id for t in self.tasks.in_state(TaskState.PARKED)), blocked=tuple(t.id for t in self.tasks.in_state(TaskState.BLOCKED)), broken_waits=tuple(t.id for t, check in self.tasks.broken_waits()))
