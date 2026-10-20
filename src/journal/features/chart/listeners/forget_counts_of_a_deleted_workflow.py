from journal.events.listener import Listener
from journal.events.models.deleted import Deleted
from journal.features.chart.support.workflow_values import WorkflowValues
from journal.models.chart import Chart
from journal.support.actor import Actor


class ForgetCountsOfADeletedWorkflow(Listener[Deleted]):
    """A deleted workflow takes its counts and times with it, in every environment."""

    def __init__(self, values: WorkflowValues) -> None:
        self.values = values

    def handle(self, event: Deleted) -> None:
        if isinstance(event.model, Chart):
            self.values.forget(event.model, Actor.system())
