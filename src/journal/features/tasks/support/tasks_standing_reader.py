from journal.features.tasks.support.tasks_standing import TasksStanding
from journal.models.agent import Agent
from journal.models.task_state import TaskState
from journal.repositories.entries import Entries
from journal.repositories.tasks import Tasks

LOOKED_BACK = 6
POLLED = 3
"""The same shell command this many times in a row, the one starting now among them, is polling."""


class TasksStandingReader:
    """Reads the tasks feature's part of the Standing for an agent."""

    def __init__(self, tasks: Tasks, entries: Entries) -> None:
        self.tasks, self.entries = tasks, entries

    def read(self, agent: Agent) -> TasksStanding:
        in_hand = self.tasks.in_hand()
        parked = self.tasks.in_state(TaskState.PARKED)
        commands = [e.data.get("tool_input", {}).get("command", "") for e in self.entries.tool_starts(agent.session, LOOKED_BACK) if e.data.get("tool_name") == "Bash"]
        return TasksStanding(in_hand=in_hand.id if in_hand else 0, parked=tuple(t.id for t in parked), blocked=tuple(t.id for t in self.tasks.in_state(TaskState.BLOCKED)), broken_waits=tuple(t.id for t, check in self.tasks.broken_waits()), first_parked_why=parked[0].parked_why if parked else "", last_commands=tuple(commands[:POLLED]))
