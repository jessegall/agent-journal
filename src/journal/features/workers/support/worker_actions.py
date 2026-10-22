from journal.events.worker_merge_result import WorkerMergeResult
from journal.events.worker_merging import WorkerMerging
from journal.hooks.command_events import CommandEvents
from datetime import datetime, timezone

from journal.events.rows.worker_reused import WorkerReused
from journal.events.rows.worker_revived import WorkerRevived
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.providers.providers import Providers
from journal.providers.support.session_inbox import SessionInbox
from journal.models.support.ref import Ref
from journal.features.workers.support.merge_outcome import MergeOutcome
from journal.models.proof import Proof
from journal.models.proof_state import ProofState
from journal.models.task import Task
from journal.repositories.proofs import Proofs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.rejection import Rejection
from journal.support.worktree_failure import WorktreeFailure
from journal.sync.team_account import TeamAccount

NOTIFY_REFUSALS = {
    WorkerState.REPORTED: "worker {n}, {name}, has reported and runs no more: give it the job with `journal worker send {n} \"<job>\"`",
    WorkerState.STOPPED: "worker {n}, {name}, was stopped: `journal worker send {n} \"<job>\"` revives it in its last session with the job",
}
STARTING = "worker {n}, {name}, has not started its process yet: notify it in a moment"
ENDED = "worker {n}, {name}, has ended and its report is being filed: wait for it, then give it the job with `journal worker send {n} \"<job>\"`"
INBOX_MISSING = "worker {n}, {name}, runs {provider}, which takes no message while it runs: wait for its report, then give it the job with `journal worker send {n} \"<job>\"`"


CHECKED_STATES = (ProofState.CHECKED, ProofState.CHECKED_UNFINISHED)

class WorkerActions:
    """What is done to a worker after its dispatch, by its command and from the viewer alike, each under the worker's lock: its next job sent, a word told while it runs, a stop, a retire."""

    def __init__(self, workers: Workers, runner: WorkerRunner, providers: Providers, inbox: SessionInbox, branch: WorkerBranch, tasks: Tasks, proofs: Proofs, events: CommandEvents, account: TeamAccount) -> None:
        self.workers, self.runner, self.providers, self.inbox, self.branch, self.tasks, self.proofs, self.events = workers, runner, providers, inbox, branch, tasks, proofs, events
        self.account = account

    def send(self, n: int, brief: str, dispatcher: str | None, actor: Actor) -> Worker:
        with self.runner.lock(n):
            return self.sent(self.local(n), brief, dispatcher, actor)

    def peer_send(self, n: int, brief: str, sender: int, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.peer(n, sender)
            if worker.is_running():
                raise Rejection(f"worker {worker.id}, {worker.name}, is out on a job: tell it with `journal worker notify {worker.id} \"<text>\"`, or send it the job once it reports")
            return self.sent(worker, brief, None, actor)

    def peer_notify(self, n: int, text: str, sender: int, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker, writer = self.peer(n, sender), self.workers.find(sender)
            return self.notified(worker, text, f"worker {writer.id}, {writer.name}", actor)

    def peer(self, n: int, sender: int) -> Worker:
        worker, writer = self.local(n), self.workers.find(sender)
        if worker.id == writer.id:
            raise Rejection(f"worker {n} is you: a job of your own you do yourself")
        if worker.adopted or worker.state == WorkerState.STOPPED:
            raise Rejection(f"worker {worker.id}, {worker.name}, is retired: only the agent that dispatched you brings it back")
        if worker.dispatcher != writer.dispatcher:
            raise Rejection(f"worker {worker.id}, {worker.name}, belongs to another agent: you message only the workers of the agent that dispatched you, `journal worker peers` lists them")
        if not self.tasks.holder_task_ids(Ref.build(worker)):
            raise Rejection(f"worker {worker.id}, {worker.name}, holds no task: you message only a peer that works on one")
        return worker

    def check(self, n: int, point: int, actor: Actor) -> Task:
        worker = self.delivered(n, "proofs to check")
        task = self.worker_task(worker)
        self.proofs.save(self.open_proof(task, point).checked(), actor)
        return task

    def short_check(self, n: int, point: int, shortfall: str, actor: Actor) -> Task:
        worker = self.delivered(n, "proofs to check")
        task = self.worker_task(worker)
        proof = self.open_proof(task, point)
        self.resumable(worker)
        self.proofs.save(proof.short(shortfall, datetime.now(timezone.utc).timestamp(), task.id, worker.id), actor)
        return task

    def open_proof(self, task: Task, point: int) -> Proof:
        proofs = self.proofs.point_proofs(task, point)
        if not proofs or proofs[-1].state in CHECKED_STATES:
            raise Rejection(f"point {point} of task {task.id} has no proof to check: only a point proved, or proved again, is checked")
        return proofs[-1]

    def merge(self, n: int, actor: Actor) -> MergeOutcome:
        worker = self.delivered(n, "work to merge")
        task = self.worker_task(worker)
        latest = {proof.point: proof for proof in sorted(self.proofs.task_proofs(task), key=lambda proof: proof.row_id)}
        unchecked = [point for point in range(1, len(task.points()) + 1) if point not in latest or latest[point].state not in CHECKED_STATES]
        if unchecked:
            raise Rejection(f"point {', '.join(map(str, unchecked))} of task {task.id} is not checked: journal worker check {worker.id} <point> first")
        self.merge_gate(WorkerMerging(environment_id=worker.environment_id, worker=worker.id, name=worker.name, task=task.id, branch=self.branch.name(worker), worktree=str(self.branch.folder(worker)), repositories=worker.repositories, files=self.branch.touched(worker) or ()))
        commit = self.branch.merge_commit(worker) if worker.worktree else ""
        self.tasks.release(Ref.build(worker), actor)
        self.workers.save(worker.merged(datetime.now(timezone.utc).timestamp()), actor)
        unfinished = [f"point {proof.point} ({proof.text})" for proof in latest.values() if proof.state == ProofState.CHECKED_UNFINISHED]
        merged = f"worker {worker.id}'s work merged as {commit}" if commit else f"worker {worker.id}'s work taken in, with no commit to merge"
        outcome = f"{merged}; not done: {', '.join(unfinished)}" if unfinished else merged
        closed = self.tasks.save(task.finished(datetime.now(timezone.utc), outcome), actor)
        self.events.worker_merge_result(WorkerMergeResult(environment_id=worker.environment_id, worker=worker.id, name=worker.name, task=task.id, branch=self.branch.name(worker), worktree=str(self.branch.folder(worker)), commits=commit))
        return MergeOutcome(closed, self.branch.dropped(self.workers.find(worker.id)))

    def merge_gate(self, event: WorkerMerging) -> None:
        refusals = self.events.worker_merging(event)
        if refusals:
            raise Rejection(f"worker {event.worker}'s work was not merged, since a plugin held it: {'; '.join(refusals)}; its proofs and its task are as they were")

    def delivered(self, n: int, purpose: str) -> Worker:
        worker = self.local(n)
        if worker.state != WorkerState.DELIVERED:
            raise Rejection(f"worker {worker.id} is {worker.state}: only a worker that clocked out has {purpose}")
        return worker

    def local(self, n: int) -> Worker:
        worker = self.workers.find(n)
        if not worker.is_device(self.account.device()):
            raise Rejection(f"worker {worker.id}, {worker.name}, runs on another machine of the team ({worker.device}): only that machine starts, stops, messages, checks or merges it")
        return worker

    def worker_task(self, worker: Worker) -> Task:
        return self.tasks.find(self.tasks.holder_task_ids(Ref.build(worker))[0])

    def release(self, n: int, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.local(n)
            if worker.is_running():
                raise Rejection(f"worker {worker.id}, {worker.name}, is still out: stop it first with journal worker stop {worker.id}")
            self.tasks.release(Ref.build(worker), actor)
            return self.workers.save(worker.released(datetime.now(timezone.utc).timestamp()), actor)

    def sent(self, worker: Worker, brief: str, dispatcher: str | None, actor: Actor) -> Worker:
        revival = worker.state == WorkerState.STOPPED or self.runner.is_ended(worker)
        if self.runner.is_ended(worker):
            worker = self.runner.recorded_end(worker, actor)
        self.resumable(worker)
        repositories = self.renewal(worker, brief)
        moved, time = worker.with_(dispatcher=worker.dispatcher if dispatcher is None else dispatcher, repositories=repositories), datetime.now(timezone.utc).timestamp()
        worker = self.workers.save(moved.resumed(brief, time, WorkerRevived if revival else WorkerReused), actor)
        self.runner.start(worker, actor)
        return worker

    def resumable(self, worker: Worker) -> None:
        if worker.is_running():
            raise Rejection(f"worker {worker.id}, {worker.name}, is still out: tell it with `journal worker notify {worker.id} \"<text>\"`, or wait for its report and send it the job then")
        if not worker.resume:
            raise Rejection(f"worker {worker.id}, {worker.name}, left no session to resume: dispatch the job again")
        if self.providers.lookup(worker.provider).transcript(self.branch.place(worker), worker.resume) is None:
            raise Rejection(f"worker {worker.id}, {worker.name}: the conversation of its session {worker.resume} is gone, so it cannot go on with its memory; dispatch the job again")

    def renewal(self, worker: Worker, brief: str) -> tuple[str, ...]:
        try:
            return self.runner.renewed(worker, brief)
        except WorktreeFailure as failed:
            raise Rejection(f"worker {worker.name} was not sent the job: {failed}") from failed

    def user_message(self, n: int, text: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.local(n)
            if worker.is_running():
                return self.notified(worker, text, "the user", actor)
            return self.sent(worker, text, None, actor)

    def notify(self, n: int, text: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            return self.notified(self.local(n), text, "the agent that dispatched you", actor)

    def notified(self, worker: Worker, text: str, sender: str, actor: Actor) -> Worker:
        refusal = self.notify_refusal(worker)
        if refusal:
            raise Rejection(refusal.format(n=worker.id, name=worker.name, provider=worker.provider.capitalize()))
        self.inbox.deliver(worker.pid, worker.resume, sender, text)
        return self.workers.save(worker.notified(text, datetime.now(timezone.utc).timestamp(), actor.stamp), actor)

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
            worker = self.workers.save(self.local(n).stopped(datetime.now(timezone.utc).timestamp(), reason), actor)
            self.runner.stop(worker)
            return worker

    def complete(self, n: int, reason: str, actor: Actor) -> tuple[Worker, str]:
        with self.runner.lock(n):
            worker = self.workers.save(self.local(n).finished(datetime.now(timezone.utc).timestamp(), reason), actor)
            self.runner.stop(worker)
            self.tasks.release(Ref.build(worker), actor)
        return worker, self.branch.dropped(worker)
