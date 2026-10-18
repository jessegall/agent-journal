from journal.engine.cards import Cards
from journal.events.models.updated import Updated
from journal.features.chart.checks import COUNT_ACTIONS, COUNT_CHECKS
from journal.events.listener import Listener
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.repositories.charts import Charts
from journal.repositories.counts import Counts


class ClearUnusedCounts(Listener[Updated]):
    """A workflow saved without any node naming one of its counts any more clears that count for every agent, and the chat says which."""

    def __init__(self, charts: Charts, counts: Counts, cards: Cards) -> None:
        self.charts, self.counts, self.cards = charts, counts, cards

    def handle(self, event: Updated) -> None:
        chart = event.model
        if not isinstance(chart, Chart) or "revision" not in event.changed():
            return
        named = {n.text.strip().partition(" ")[0] for n in self.charts.nodes_of(chart) if n.key in (*COUNT_ACTIONS, *COUNT_CHECKS)}
        prefix = f"charts:{chart.id}:"
        gone = [c for c in self.counts.all() if c.name.startswith(prefix) and c.name[len(prefix):] not in named]
        for count in gone:
            self.counts.delete(count, Actor.system())
        for name, environment_id in sorted({(c.name[len(prefix):], c.environment_id) for c in gone}):
            self.cards.show(environment_id, "", f"The count {name} is no longer used in {chart.title} and was cleared", "list")
