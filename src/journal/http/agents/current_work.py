from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.support.states_catalogue import StatesCatalogue
from journal.features.tasks.states.working import Working
from journal.models.agent import Agent
from journal.models.task import Task
from journal.repositories.not_found import NotFound
from journal.repositories.tasks import Tasks


@dataclass(frozen=True)
class AgentWork:
    """The task an agent has in hand and, while it is paused on top of it, what it waits for."""

    task: Task
    awaiting: str = ""
    awaiting_on: str = ""


class CurrentWork:
    """Reads an agent's state down through its pauses to the task it holds: the viewer's status line names the task, or "Waiting for …" while a pause stands on it."""

    def __init__(self, states: StatesCatalogue, tasks: Tasks) -> None:
        self.states, self.tasks = states, tasks

    def of(self, agent: Agent) -> AgentWork | None:
        state = self.states.named(agent.state, agent.data)
        while isinstance(state, Paused):
            state = self.states.resumed(state)
        if not isinstance(state, Working):
            return None
        try:
            return AgentWork(self.tasks.find(state.task_id), *self.awaited(agent))
        except NotFound:
            return None

    def awaited(self, agent: Agent) -> tuple[str, str]:
        """What the agent waits for and on what, from the topmost pause that names it, with a task in hand or none."""
        state = self.states.named(agent.state, agent.data)
        while isinstance(state, Paused):
            if state.awaiting()[0]:
                return state.awaiting()
            state = self.states.resumed(state)
        return "", ""
