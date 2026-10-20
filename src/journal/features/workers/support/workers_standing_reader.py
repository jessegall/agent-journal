from journal.features.workers.support.workers_standing import WorkersStanding
from journal.models.agent import Agent
from journal.repositories.workers import Workers


class WorkersStandingReader:
    """Reads the workers feature's part of the Standing for an agent."""

    def __init__(self, workers: Workers) -> None:
        self.workers = workers

    def read(self, agent: Agent) -> WorkersStanding:
        return WorkersStanding(out=tuple(w.id for w in self.workers.out()), reports_waiting=tuple(w.id for w in self.workers.reports_waiting()))
