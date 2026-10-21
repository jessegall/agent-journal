from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.states.wait import Wait
from journal.support.states_catalogue import StatesCatalogue
from journal.features.tasks.states.working import Working
from journal.models.agent import Agent
from journal.models.task import Task
from journal.support.not_found import NotFound
from journal.repositories.tasks import Tasks


@dataclass(frozen=True)
class AgentWork:
    """The task an agent has in hand and, while it is paused on top of it, what it waits for."""

    task: Task
    awaiting: str = ""
    awaiting_on: str = ""


class CurrentWork:
    """Reads an agent's stack down through its waits to the task it holds: the viewer's status line names the task, or "Waiting for …" while a wait stands on it, from the topmost wait that names what it waits for."""

    def __init__(self, states: StatesCatalogue, tasks: Tasks) -> None:
        self.states, self.tasks = states, tasks

    def of(self, agent: Agent) -> AgentWork | None:
        working = next((layer for layer in reversed(self.states.stack_of(agent).states) if isinstance(layer, Working)), None)
        if working is None:
            return None
        try:
            return AgentWork(self.tasks.find(working.task_id), *self.awaited(agent))
        except NotFound:
            return None

    def awaited(self, agent: Agent) -> tuple[str, str]:
        layers = self.states.stack_of(agent).states
        return next((layer.awaiting() for layer in reversed(layers) if isinstance(layer, (Wait, Paused)) and layer.awaiting()[0]), ("", ""))
