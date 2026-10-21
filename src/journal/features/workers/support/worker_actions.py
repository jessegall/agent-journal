from datetime import datetime, timezone

from journal.events.rows.worker_reused import WorkerReused
from journal.events.rows.worker_revived import WorkerRevived
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.providers.providers import Providers
from journal.providers.support.session_inbox import SessionInbox
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.rejection import Rejection
from journal.support.worktree_failure import WorktreeFailure

NOTIFY_REFUSALS = {
    WorkerState.REPORTED: "worker {n}, {name}, has reported and runs no more: give it the job with `journal worker send {n} \"<job>\"`",
    WorkerState.STOPPED: "worker {n}, {name}, was stopped: `journal worker send {n} \"<job>\"` revives it in its last session with the job",
}
STARTING = "worker {n}, {name}, has not started its process yet: notify it in a moment"
ENDED = "worker {n}, {name}, has ended and its report is being filed: wait for it, then give it the job with `journal worker send {n} \"<job>\"`"
INBOX_MISSING = "worker {n}, {name}, runs {provider}, which takes no message while it runs: wait for its report, then give it the job with `journal worker send {n} \"<job>\"`"


class WorkerActions:
    """What is done to a worker after its dispatch, by its command and from the viewer alike, each under the worker's lock: its next job sent, a word told while it runs, a stop, a retire."""

    def __init__(self, workers: Workers, runner: WorkerRunner, providers: Providers, inbox: SessionInbox, branch: WorkerBranch) -> None:
        self.workers, self.runner, self.providers, self.inbox, self.branch = workers, runner, providers, inbox, branch

    def send(self, n: int, brief: str, dispatcher: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            return self.sent(self.workers.find(n), brief, dispatcher, actor)

    def peer_send(self, n: int, brief: str, sender: int, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.peer(n, sender)
            if worker.is_running():
                raise Rejection(f"worker {worker.id}, {worker.name}, is out on a job: tell it with `journal worker notify {worker.id} \"<text>\"`, or send it the job once it reports")
            return self.sent(worker, brief, "", actor)

    def peer_notify(self, n: int, text: str, sender: int, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker, writer = self.peer(n, sender), self.workers.find(sender)
            return self.notified(worker, text, f"worker {writer.id}, {writer.name}", actor)

    def peer(self, n: int, sender: int) -> Worker:
        worker, writer = self.workers.find(n), self.workers.find(sender)
        if worker.id == writer.id:
            raise Rejection(f"worker {n} is you: a job of your own you do yourself")
        if worker.adopted or worker.state == WorkerState.STOPPED:
            raise Rejection(f"worker {worker.id}, {worker.name}, is retired: only the agent that dispatched you brings it back")
        if worker.dispatcher != writer.dispatcher:
            raise Rejection(f"worker {worker.id}, {worker.name}, belongs to another agent: you message only the workers of the agent that dispatched you, `journal worker peers` lists them")
        return worker

    def sent(self, worker: Worker, brief: str, dispatcher: str, actor: Actor) -> Worker:
        revival = worker.state == WorkerState.STOPPED or self.runner.is_ended(worker)
        if self.runner.is_ended(worker):
            worker = self.runner.settle(worker, actor)
        self.resumable(worker)
        moved, time = worker.with_(dispatcher=dispatcher or worker.dispatcher), datetime.now(timezone.utc).timestamp()
        worker = self.workers.save(moved.resumed(brief, time, WorkerRevived if revival else WorkerReused), actor)
        self.runner.start(worker, actor)
        return worker

    def resumable(self, worker: Worker) -> None:
        if worker.state == WorkerState.DISPATCHED:
            raise Rejection(f"worker {worker.id}, {worker.name}, is still out: tell it with `journal worker notify {worker.id} \"<text>\"`, or wait for its report and send it the job then")
        if not worker.resume:
            raise Rejection(f"worker {worker.id}, {worker.name}, left no session to resume: dispatch the job again")
        if self.providers.lookup(worker.provider).transcript(self.runner.place(worker), worker.resume) is None:
            raise Rejection(f"worker {worker.id}, {worker.name}: the conversation of its session {worker.resume} is gone, so it cannot go on with its memory; dispatch the job again")
        try:
            self.runner.renewed(worker)
        except WorktreeFailure as failed:
            raise Rejection(f"worker {worker.name} was not sent the job: {failed}") from failed

    def notify(self, n: int, text: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            return self.notified(self.workers.find(n), text, "the agent that dispatched you", actor)

    def notified(self, worker: Worker, text: str, sender: str, actor: Actor) -> Worker:
        refusal = self.notify_refusal(worker)
        if refusal:
            raise Rejection(refusal.format(n=worker.id, name=worker.name, provider=worker.provider.capitalize()))
        self.inbox.deliver(worker.pid, worker.resume, sender, text)
        return self.workers.save(worker.notified(text, datetime.now(timezone.utc).timestamp()), actor)

    def notify_refusal(self, worker: Worker) -> str:
        if worker.state in NOTIFY_REFUSALS:
            return NOTIFY_REFUSALS[worker.state]
        if not worker.pid:
            return STARTING
        if self.runner.is_ended(worker):
            return ENDED
        return "" if self.providers.lookup(worker.provider).session_inbox else INBOX_MISSING

    def stop(self, n: int, reason: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.workers.save(self.workers.find(n).stopped(datetime.now(timezone.utc).timestamp(), reason), actor)
            self.runner.stop(worker)
            return worker

    def complete(self, n: int, reason: str, actor: Actor) -> tuple[Worker, str]:
        with self.runner.lock(n):
            worker = self.workers.save(self.workers.find(n).finished(datetime.now(timezone.utc).timestamp(), reason), actor)
            self.runner.stop(worker)
        return worker, self.branch.dropped(worker)
