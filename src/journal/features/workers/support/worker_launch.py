from collections.abc import Callable

from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.time_source import TimeSource


class WorkerLaunch:
    """The one way an agent is sent, a worker an agent dispatches and a verifier the journal sends alike: its process started and its row marked dispatched, by the agent or by the journal alone, which writes its chat mark."""

    def __init__(self, workers: Workers, runner: WorkerRunner, time_source: TimeSource) -> None:
        self.time_source = time_source
        self.workers, self.runner = workers, runner

    def launched(self, worker: Worker, actor: Actor, repositories: tuple[str, ...] = (), branch: str = "", move: Callable[[Worker, float], Worker] = Worker.dispatched) -> Worker:
        placed = self.workers.save(worker.with_(repositories=repositories or worker.repositories, branch=branch or worker.branch), actor)
        self.runner.start(placed, actor)
        return self.workers.save(move(self.workers.find(worker.row_id), self.time_source.seconds()), actor)
