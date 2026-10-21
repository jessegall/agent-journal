from dataclasses import dataclass

from journal.engine.states.wait import Wait
from journal.engine.states_catalogue import StatesCatalogue
from journal.features.tasks.states.working import Working
from journal.models.agent import Agent
from journal.models.task import Task
from journal.support.missing_row import MissingRow
from journal.repositories.tasks import Tasks


@dataclass(frozen=True)
class AgentWork:
    """The task an agent has in hand and, while it is paused on top of it, what it waits for."""

    task: Task
    wait_text: str = ""
    wait_refs: str = ""


class CurrentWork:
    """Reads an agent's stack down through its waits to the task it holds: the viewer's status line names the task, or "Waiting for …" while a wait stands on it, from the topmost wait that names what it waits for."""

    def __init__(self, states: StatesCatalogue, tasks: Tasks) -> None:
        self.states, self.tasks = states, tasks

    def work(self, agent: Agent) -> AgentWork | None:
        working = next((layer for layer in reversed(self.states.stack(agent).states) if isinstance(layer, Working)), None)
        if working is None:
            return None
        try:
            return AgentWork(self.tasks.find(working.task_id), *self.wait_text(agent))
        except MissingRow:
            return None

    def wait_text(self, agent: Agent) -> tuple[str, str]:
        layers = self.states.stack(agent).states
        return next((layer.wait_description() for layer in reversed(layers) if isinstance(layer, Wait) and layer.wait_description()[0]), ("", ""))
