from journal.engine.job import Job
from journal.features.shell.support.restart_queue import RestartQueue


class RestartWait(Job):
    """Every two seconds each environment's restart that waits on running commands is looked at, and done once the last of them has ended."""

    interval_seconds = 2.0

    def __init__(self, queue: RestartQueue) -> None:
        self.queue = queue

    def tick(self, time: float) -> None:
        for environment_id in self.queue.waiting():
            self.queue.release(environment_id)
