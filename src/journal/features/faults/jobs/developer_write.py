from journal.engine.job import Job
from journal.features.faults.support.developer_tally import DeveloperTally


class DeveloperWrite(Job):
    """Every five seconds the developer numbers held in memory are written to their rows, so a request never waits on writing its own."""

    interval_seconds = 5.0

    def __init__(self, tally: DeveloperTally) -> None:
        self.tally = tally

    def tick(self, time: float) -> None:
        self.tally.write()
