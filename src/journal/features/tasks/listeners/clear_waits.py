from datetime import datetime, timezone
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.actor import Actor
from journal.features.tasks.support.wait_targets import WaitTargets
from journal.repositories.tasks import Tasks


class ClearWaits(Listener[Updated]):
    """A question answered, a task closed or a check waited until passing unblocks the blocked tasks that wait on it by a link, once nothing else holds them, and says so of the parked ones; the live agent is told."""

    def __init__(self, tasks: Tasks) -> None:
        self.tasks = tasks

    def handle(self, event: Updated) -> None:
        if not WaitTargets.is_newly_resolved(event):
            return
        for task in self.tasks.ready_waiting_tasks(event.model):
            self.tasks.save(task.wait_ended(f"the {event.model.noun()} {event.model.id} it waited on is done", datetime.now(timezone.utc).timestamp()), Actor.system())
