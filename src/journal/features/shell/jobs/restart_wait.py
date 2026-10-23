from journal.engine.job import Job
from journal.features.shell.support.restart_queue import RestartQueue
from journal.supervisor_link import SupervisorLink


class RestartWait(Job):
    """Every two seconds the restart of this journal, when it waits on running commands, is looked at, and done once the last of them has ended."""

    interval_seconds = 2.0

    def __init__(self, queue: RestartQueue, supervisor: SupervisorLink) -> None:
        self.queue, self.supervisor = queue, supervisor

    def tick(self, time: float) -> None:
        host = self.supervisor.hosting()
        if host in self.queue.waiting():
            self.queue.release(host)
