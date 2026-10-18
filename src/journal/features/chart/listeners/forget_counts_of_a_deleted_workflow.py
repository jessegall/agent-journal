from journal.events.models.deleted import Deleted
from journal.events.listener import Listener
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.repositories.counts import Counts


class ForgetCountsOfADeletedWorkflow(Listener[Deleted]):
    """A deleted workflow takes its counts with it."""

    def __init__(self, counts: Counts) -> None:
        self.counts = counts

    def handle(self, event: Deleted) -> None:
        chart = event.model
        if not isinstance(chart, Chart):
            return
        for count in [c for c in self.counts.all() if c.name.startswith(f"charts:{chart.id}:")]:
            self.counts.delete(count, Actor.system())
