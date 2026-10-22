from journal.events.listener import Listener
from journal.events.rows.row_event import RowEvent
from journal.events.rows.task_briefed import TaskBriefed
from journal.events.rows.task_closed import TaskClosed
from journal.models.proof_state import ProofState
from journal.models.support.ref import Ref
from journal.repositories.proofs import Proofs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor

RELEASING = ("done", "cancelled")


class WorkerTaskChanges(Listener[RowEvent]):
    """What the user does to a worker's task reaches the worker's rows: a task done or cancelled releases its worker, and a brief written anew marks the proofs of its changed points stale."""

    def __init__(self, tasks: Tasks, workers: Workers, proofs: Proofs) -> None:
        self.tasks, self.workers, self.proofs = tasks, workers, proofs

    def handle(self, event: RowEvent) -> None:
        if isinstance(event, TaskClosed) and event.outcome in RELEASING:
            self.released(event)
        if isinstance(event, TaskBriefed) and event.points:
            self.staled(event)

    def released(self, event: TaskClosed) -> None:
        holder = self.tasks.holder(self.tasks.find(event.task_id))
        if holder is None or holder.type != "workers":
            return
        self.tasks.release(holder, Actor.system())
        self.workers.save(self.workers.find(holder.id).released(event.time), Actor.system())

    def staled(self, event: TaskBriefed) -> None:
        for proof in self.proofs.task_proofs(self.tasks.find(event.task_id)):
            if proof.point in event.points:
                self.proofs.save(proof.with_(state=ProofState.STALE), Actor.system())
