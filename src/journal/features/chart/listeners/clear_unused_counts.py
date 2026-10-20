from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.chart.support.checks import VALUE_STEPS
from journal.features.chart.support.workflow_values import WorkflowValues
from journal.models.chart import Chart
from journal.repositories.charts import Charts
from journal.support.actor import Actor
from journal.support.cards import Cards
from journal.support.chat_mark import ChatMark


class ClearUnusedCounts(Listener[Updated]):
    """A workflow saved without any node naming one of its counts or times any more clears that value in every environment, and the chat says which."""

    def __init__(self, charts: Charts, values: WorkflowValues, cards: Cards) -> None:
        self.charts, self.values, self.cards = charts, values, cards

    def handle(self, event: Updated) -> None:
        chart = event.model
        if not isinstance(chart, Chart) or "revision" not in event.changed():
            return
        named = {n.text.strip().partition(" ")[0] for n in self.charts.nodes_of(chart) if n.key in VALUE_STEPS}
        for name, environment_id in self.values.forget_unnamed(chart, named, Actor.system()):
            self.cards.show(environment_id, "", f"The value {name} is no longer used in {chart.title} and was cleared", "list", shows=ChatMark.WORKFLOWS)
