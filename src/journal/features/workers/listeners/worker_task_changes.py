from journal.events.listener import Listener
from journal.events.rows.row_event import RowEvent
from journal.events.rows.task_edited import TaskEdited
from journal.events.rows.task_closed import TaskClosed
from journal.features.workers.support.worker_actions import WorkerActions
from journal.models.proof_state import ProofState
from journal.models.task import Task
from journal.repositories.proofs import Proofs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.agent_actor import AgentActor
from journal.support.phone_actor import PhoneActor
from journal.support.user_actor import UserActor

RELEASING = ("completed", "cancelled")
BLOCKED = "blocked"
DROPPING_ACTORS = (UserActor, PhoneActor, AgentActor)
DROPPED_LINE = "task {task} was blocked while you worked on it and is no longer yours: leave it, keep what you committed on your branch, and go on with your queue"


class WorkerTaskChanges(Listener[RowEvent]):
    """What the user does to a worker's task reaches the worker's rows: a task done or cancelled is let go by its worker, which is released once it holds no other task, a task the user or the agent blocked under its worker is let go too and the worker is told in its session to go on with its queue, a task done, cancelled or blocked while it waits in a worker's queue leaves the queue, a blocked one offered again once it opens, and a title or brief written anew marks the proofs of its changed points that were shown before the edit stale and, for a worker that is not running, is kept on its row to be said with its next job."""

    def __init__(self, tasks: Tasks, workers: Workers, proofs: Proofs, actions: WorkerActions) -> None:
        self.tasks, self.workers, self.proofs, self.actions = tasks, workers, proofs, actions

    def handle(self, event: RowEvent) -> None:
        if isinstance(event, TaskClosed) and event.outcome in RELEASING:
            self.closed(event, self.tasks.find(event.task_id))
        if isinstance(event, TaskClosed) and event.outcome == BLOCKED and isinstance(Actor.parse(event.actor), DROPPING_ACTORS):
            self.dropped(event)
        if isinstance(event, TaskClosed) and event.outcome == BLOCKED:
            self.tasks.unqueued_task(self.tasks.find(event.task_id), Actor.system())
        if isinstance(event, TaskEdited):
            self.edited(event)

    def closed(self, event: TaskClosed, task: Task) -> None:
        if not task.delegated:
            return
        self.released(event, task)
        self.tasks.unqueued_task(task, Actor.system())

    def released(self, event: TaskClosed, task: Task) -> None:
        holder = self.tasks.holder(task)
        if holder is None or holder.type != "workers":
            return
        self.tasks.release_task(holder, event.task_id, Actor.system())
        if not self.tasks.holder_task_ids(holder):
            self.workers.save(self.workers.find(holder.id).released(event.time), Actor.system())

    def dropped(self, event: TaskClosed) -> None:
        task = self.tasks.find(event.task_id)
        holder = self.tasks.holder(task) if task.delegated else None
        if holder is None or holder.type != "workers":
            return
        self.released(event, task)
        worker = self.workers.find(holder.id)
        if not self.actions.notify_refusal(worker):
            self.actions.notified(worker, DROPPED_LINE.format(task=event.task_id), "the journal", Actor.system())

    def edited(self, event: TaskEdited) -> None:
        task = self.tasks.find(event.task_id)
        for proof in self.proofs.changed_point_proofs(task, event.points):
            if proof.creation_time.timestamp() > event.time:
                continue
            self.proofs.save(proof.with_(state=ProofState.STALE), Actor.system())
        holder = self.tasks.holder(task)
        if holder is not None and holder.type == "workers" and not (worker := self.workers.find(holder.id)).is_running():
            self.workers.save(worker.with_(edited_task=task.id), Actor.system())
