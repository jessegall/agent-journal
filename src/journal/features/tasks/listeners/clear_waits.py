from datetime import datetime, timezone
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.actor import Actor
from journal.features.tasks.support.wait_targets import WaitTargets
from journal.repositories.tasks import Tasks


class ClearWaits(Listener[Updated]):
    """A question answered, a task closed or a check waited until passing unblocks the tasks that wait on it by a link, once nothing else holds them, and the live agent is told."""

    def __init__(self, tasks: Tasks) -> None:
        self.tasks = tasks

    def handle(self, event: Updated) -> None:
        if not WaitTargets.is_newly_resolved(event):
            return
        for task in self.tasks.waiting_refs(event.model):
            if not self.tasks.open_waits(task):
                self.tasks.save(task.unblocked(f"the {event.model.noun()} {event.model.id} it waited on is done", datetime.now(timezone.utc).timestamp()), Actor.system())
