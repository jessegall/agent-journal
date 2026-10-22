from journal.events.listener import Listener
from journal.events.rows.proof_short import ProofShort
from journal.features.workers.support.worker_actions import WorkerActions
from journal.support.actor import Actor


class ShortfallReturn(Listener[ProofShort]):
    """A point checked short goes back to the worker that proved it, in its last session, as its next job on the same task."""

    def __init__(self, actions: WorkerActions) -> None:
        self.actions = actions

    def handle(self, event: ProofShort) -> None:
        self.actions.send(event.worker_id, f"Point {event.point} of task {event.task_id} came back short: {event.shortfall}. Prove it again, then clock out.", None, Actor.system())
