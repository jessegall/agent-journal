from journal.models.agent import Agent
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.repositories.agents import Agents
from journal.repositories.workers import Workers
from journal.support.missing_row import MissingRow

SESSION_CHARACTERS = 8


class TaskHolders:
    """Who holds a task in hand, in the words the viewer shows: a worker by its number and name, an agent by its program and session."""

    def __init__(self, agents: Agents, workers: Workers) -> None:
        self.agents, self.workers = agents, workers

    def name(self, holder: Ref) -> str:
        try:
            if holder.type == Worker.table():
                return self.worker_name(self.workers.find(holder.id))
            return self.agent_name(self.agents.find(holder.id))
        except MissingRow:
            return ""

    @staticmethod
    def agent_name(agent: Agent) -> str:
        return f"the {agent.provider} agent, session {agent.session[:SESSION_CHARACTERS]}"

    @staticmethod
    def worker_name(worker: Worker) -> str:
        return f"worker {worker.id}, {worker.name}"
