from journal.events.worker_merge_result import WorkerMergeResult
from journal.events.worker_merging import WorkerMerging
from journal.engine.command_events import CommandEvents

from journal.events.rows.worker_reused import WorkerReused
from journal.events.rows.worker_next_job_sent import WorkerNextJobSent
from journal.events.moments.worker_work_merged import WorkerWorkMerged
from journal.events.rows.worker_revived import WorkerRevived
from journal.features.workers.support.failed_runs import FailedRuns
from journal.events.moments.worker_merge_clash import WorkerMergeClash
from journal.features.workers.support.merge_clash import MergeClash
from journal.support.merger import Merger
from journal.support.time_source import TimeSource
from journal.features.workers.support.worker_branch import REBASE_STEPS, WorkerBranch
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import JOB_MOVE, REJECTION_MOVE, Worker
from journal.models.worker_state import WorkerState
from journal.providers.providers import Providers
from journal.providers.support.session_inbox import SessionInbox
from journal.models.support.ref import Ref
from journal.features.workers.support.merge_outcome import MergeOutcome
from journal.features.workers.support.merge_statuses import MergeStatuses
from journal.features.workers.support.merge_steps import MergeSteps
from journal.models.proof import Proof
from journal.features.workers.support.worker_task_assigner import WorkerTaskAssigner
from journal.models.proof_state import ProofState
from journal.models.task import Task
from journal.repositories.proofs import Proofs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.rejection import Rejection
from journal.support.worktree_failure import WorktreeFailure
from journal.repositories.setting_rows import SettingRows
from journal.features.workers.workers_options import WorkersOptions

NOTIFY_REFUSALS = {
    WorkerState.REPORTED: "worker {n}, {name}, has reported and runs no more: give it the job with `journal worker send {n} \"<job>\"`",
    WorkerState.STOPPED: "worker {n}, {name}, was stopped: `journal worker send {n} \"<job>\"` revives it in its last session with the job",
}
STARTING = "worker {n}, {name}, has not started its process yet: notify it in a moment"
ENDED = "worker {n}, {name}, has ended and its report is being filed: wait for it, then give it the job with `journal worker send {n} \"<job>\"`"
INBOX_MISSING = "worker {n}, {name}, runs {provider}, which takes no message while it runs: wait for its report, then give it the job with `journal worker send {n} \"<job>\"`"


CHECKED_STATES = (ProofState.CHECKED, ProofState.CHECKED_UNFINISHED)
# a worker whose checked work can be taken in: clocked out, or stopped or ended before it clocked out
MERGEABLE_STATES = (WorkerState.DELIVERED, WorkerState.STOPPED, WorkerState.UNFINISHED)
EDITED_NOTE = "Task {task} was changed while you were away: read it again with journal task show {task}. Then: "
REBASE_NOTE = f"The journal rebased your worktree onto the project's branch, at {{heads}}, and {{clashing}}. First {REBASE_STEPS}. Then: "
MOVED_NOTE = "The journal rebased your worktree onto the project's branch, at {heads}, so files may have changed since your last job. "
SESSION_BUSY_REFUSAL = "worker {n}'s last session still runs, and {provider} takes no message while it runs: wait for it to end, then send the job"
REDO_MOVE = REJECTION_MOVE

class WorkerActions:
    """What is done to a worker after its dispatch, by its command and from the viewer alike, each under the worker's lock: its next job sent, a new task handed to it before its session is started or told, or a point sent back, into the session it still runs in when its process lives on, so it never runs in two sessions and keeps its token, else in a new run of its last session; a word informed while it runs, a stop, a retire. A check names the task the worker is on, or one of its queue it finished, which waits for the same merge; every point found short is saved at once, the last one's save sending the worker back with the others' reasons too, since that send-back ends its clock-out; one unchecked point of any task the merge would close refuses the whole merge, naming the task."""

    def __init__(self, workers: Workers, runner: WorkerRunner, providers: Providers, inbox: SessionInbox, branch: WorkerBranch, tasks: Tasks, proofs: Proofs, events: CommandEvents, failures: FailedRuns, settings: SettingRows, merger: Merger, time_source: TimeSource, statuses: MergeStatuses, assigner: WorkerTaskAssigner) -> None:
        self.assigner = assigner
        self.workers, self.runner, self.providers, self.inbox, self.branch, self.tasks, self.proofs, self.events = workers, runner, providers, inbox, branch, tasks, proofs, events
        self.failures, self.settings, self.merger, self.time_source, self.statuses = failures, settings, merger, time_source, statuses

    def task_holdings(self, number: int, task: int | None) -> tuple[int, ...]:
        holdings = self.tasks.holder_task_ids(Ref(Worker.table(), number))
        if task and holdings and task not in holdings:
            raise Rejection(f"worker {number} works on task {holdings[0]} until it is merged or released: send it that task's next job")
        return holdings

    def send(self, n: int, brief: str, dispatcher: str | None, actor: Actor) -> Worker:
        with self.runner.lock(n):
            return self.relaunch(self.workers.find(n), brief, dispatcher, actor, JOB_MOVE)

    def queue_resumed(self, n: int, brief: str, actor: Actor) -> None:
        with self.runner.lock(n):
            worker = self.workers.find(n)
            if worker.is_ended_mid_queue():
                self.relaunch(worker, brief, None, actor, JOB_MOVE)

    def resend(self, n: int, brief: str, model: str, profile: str | None, dispatcher: str | None, actor: Actor, task: Task | None = None) -> Worker:
        with self.runner.lock(n):
            return self.relaunch(self.workers.find(n).with_(model=model, profile=profile), brief, dispatcher, actor, JOB_MOVE, task=task)

    def redo(self, n: int, brief: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            return self.relaunch(self.workers.find(n), brief, None, actor, REDO_MOVE)

    def peer_send(self, n: int, brief: str, sender: int, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.peer(n, sender)
            if worker.is_running():
                raise Rejection(f"worker {worker.id}, {worker.name}, is out on a job: `journal worker notify {worker.id} \"<text>\"`")
            return self.relaunch(worker, brief, None, actor, JOB_MOVE)

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
            raise Rejection(f"worker {worker.id}, {worker.name}, is another agent's: `journal worker peers` lists yours")
        if not self.tasks.holder_task_ids(Ref.build(worker)):
            raise Rejection(f"worker {worker.id}, {worker.name}, has no task: you message only a peer that works on one")
        return worker

    def check(self, n: int, point: int, actor: Actor, task_id: int = 0) -> Task:
        worker = self.mergeable(n, "proofs to check")
        task = self.checked_task(worker, task_id)
        self.proofs.save(self.open_proof(task, point).checked(), actor)
        return task

    def checked_task(self, worker: Worker, task_id: int) -> Task:
        if not task_id and not self.tasks.holder_task_ids(Ref.build(worker)):
            raise Rejection(f"worker {worker.id} has no task now: add --task <n>; waiting for the merge: {', '.join(f'task {n}' for n in self.merged_task_ids(worker)) or 'none'}")
        if not task_id:
            return self.worker_task(worker)
        if task_id not in self.merged_task_ids(worker):
            raise Rejection(f"worker {worker.id} has no task {task_id} to check: its tasks waiting for the merge are {', '.join(f'task {n}' for n in self.merged_task_ids(worker))}")
        return self.tasks.find(task_id)

    def merged_task_ids(self, worker: Worker) -> tuple[int, ...]:
        return (*self.tasks.finished_task_ids(Ref.build(worker)), *self.tasks.holder_task_ids(Ref.build(worker)))

    def short_check(self, n: int, point: int, shortfall: str, actor: Actor, task_id: int = 0) -> Task:
        return self.short_checks(n, [(point, shortfall)], actor, task_id)

    def short_checks(self, n: int, shortfalls: list[tuple[int, str]], actor: Actor, task_id: int = 0) -> Task:
        worker = self.delivered(n, "proofs to check")
        task = self.checked_task(worker, task_id)
        if task.id in self.tasks.finished_task_ids(Ref.build(worker)):
            self.tasks.reopen_holder_task(task.id, Ref.build(worker), actor)
        *first_shortfalls, (point, shortfall) = shortfalls
        proof = self.open_proof(task, point)
        prior_shortfalls = tuple(proof.shortfall for proof in self.proofs.short_proofs(task))
        for number, reason in first_shortfalls:
            self.proofs.save(self.open_proof(task, number).with_shortfall(reason), actor)
        self.resumable(worker)
        shortfall_lines = "; ".join((shortfall, *(f"point {number} is short too: {reason}" for number, reason in first_shortfalls)))
        self.proofs.save(proof.short(self.failures.with_output(worker, shortfall_lines), self.time_source.moment().timestamp(), task.id, worker.id, worker.dispatcher, prior_shortfalls, worker.model), actor)
        return task

    def open_proof(self, task: Task, point: int) -> Proof:
        proofs = self.proofs.point_proofs(task, point)
        if not proofs or proofs[-1].state in CHECKED_STATES:
            raise Rejection(f"point {point} of task {task.id} has no proof to check: only a point proved, or proved again, is checked")
        return proofs[-1]

    def merge(self, n: int, actor: Actor, steps: MergeSteps) -> MergeOutcome:
        worker = self.mergeable(n, "work to merge")
        *finished, task = self.merged_tasks(worker)
        latest = self.latest_proofs(task)
        steps.started(1, f", for up to {self.settings.integer(WorkersOptions.MERGE_WINDOW_SECONDS)} seconds")
        with self.statuses.watched(worker.id, steps.status):
            self.merge_gate(self.branch.merging_event(WorkerMerging, worker, task.id, self.settings.integer(WorkersOptions.MERGE_WINDOW_SECONDS) * 1000))
        worker = self.gated(n, task)
        queued = self.merger.queued()
        steps.started(2, self.queue_note(queued), f"waiting in the merge queue behind {queued} merges" if queued else "")
        with self.merger.turn():
            steps.status(MergeSteps.sentence(2))
            merged_total, merged_shas = self.branch.merged_lines(worker), self.branch.merged_shas(worker)
            commit = self.merge_commit(worker, task)
            unfinished = [f"point {proof.point} ({proof.text})" for proof in latest.values() if proof.state == ProofState.CHECKED_UNFINISHED]
            merged = f"worker {worker.id}'s work merged as {commit}" if commit else f"worker {worker.id}'s work taken in, with no commit to merge"
            outcome = f"{merged}; not done: {', '.join(unfinished)}" if unfinished else merged
            steps.started(3)
            closed = self.tasks.save(task.merge_completed(self.time_source.moment(), outcome, worker.id), actor)
            self.tasks.release_task(Ref.build(worker), task.id, actor)
            closed_queue = tuple(self.tasks.save(queued_task.merge_completed(self.time_source.moment(), merged, worker.id), actor) for queued_task in finished)
            self.release_rest(worker, actor)
            self.workers.save(worker.merged(task.id, self.time_source.moment().timestamp()), actor)
            self.events.worker_merge_result(WorkerMergeResult(environment_id=worker.environment_id, worker=worker.id, name=worker.name, task=task.id, branch=self.branch.name(worker), worktree=str(self.branch.folder(worker)), commits=commit))
            steps.started(4)
            worktree_line = self.merged_worktree_line(self.workers.find(worker.id))
        steps.started(5)
        next_line, next_task = self.send_next(worker.id, actor, WorkerNextJobSent)
        if not next_task:
            self.workers.save(self.workers.find(worker.id).queue_emptied(self.time_source.moment().timestamp()), actor)
        self.events.worker_work_merged(WorkerWorkMerged(environment_id=worker.environment_id, worker=worker.id, name=worker.name, dispatcher=worker.dispatcher, task=task.id, next_task=next_task, time=self.time_source.moment().timestamp(), lines=merged_total, merged_shas=merged_shas))
        return MergeOutcome(closed, worktree_line, next_line, closed_queue)

    @staticmethod
    def queue_note(queued: int) -> str:
        return f", after the {queued} merges before it in the queue" if queued else ""

    def gated(self, n: int, task: Task) -> Worker:
        worker = self.mergeable(n, "work to merge")
        if task.id not in self.merged_task_ids(worker):
            raise Rejection(f"worker {worker.id} let go of task {task.id} while the plugins were asked about it: nothing was merged")
        return worker

    def latest_proofs(self, task: Task) -> dict[int, Proof]:
        return {proof.point: proof for proof in sorted(self.proofs.task_proofs(task), key=lambda proof: proof.row_id)}

    def unchecked_line(self, worker: Worker) -> str:
        tasks = (*(self.tasks.find(task_id) for task_id in self.tasks.finished_task_ids(Ref.build(worker))), self.worker_task(worker))
        unchecked = [f"task {task.id} point {point}" for task in tasks for point in self.unchecked_points(task)]
        return f"skipped: {', '.join(unchecked)} not checked yet" if unchecked else ""

    def unchecked_points(self, task: Task) -> list[int]:
        latest = self.latest_proofs(task)
        return [point for point in range(1, len(task.points()) + 1) if point not in latest or latest[point].state not in CHECKED_STATES]

    def unchecked_refusal(self, worker: Worker, task: Task, task_option: str) -> str:
        unchecked = self.unchecked_points(task)
        return f"point {', '.join(map(str, unchecked))} of task {task.id} unchecked: `journal worker check {worker.id} <n>{task_option}`" if unchecked else ""

    def merge_commit(self, worker: Worker, task: Task) -> str:
        try:
            return self.branch.merge_commit(worker) if worker.worktree else ""
        except MergeClash as clash:
            self.events.worker_merge_refused(WorkerMergeClash(environment_id=worker.environment_id, worker=worker.id, name=worker.name, dispatcher=worker.dispatcher, task=task.id, clashing=clash.clashing, line=str(clash)))
            raise

    def next_job(self, n: int, actor: Actor) -> str:
        return self.send_next(n, actor, WorkerReused)[0]

    def send_next(self, n: int, actor: Actor, reused: type[WorkerReused]) -> tuple[str, int]:
        current_tasks = self.tasks.holder_task_ids(Ref.build(self.workers.find(n)))
        if current_tasks:
            return f"it is already on task {current_tasks[0]} from its queue", current_tasks[0]
        task = self.assigner.following(self.workers.find(n))
        if task is None:
            return "", 0
        try:
            with self.runner.lock(n):
                self.relaunch(self.workers.find(n), f"Your next task, {task.id}: {task.title}. {task.brief}", None, actor, JOB_MOVE, reused, task)
        except Rejection as refused:
            return f"its next queued task {task.id} was not sent, since {refused}", 0
        return f"it went straight on to task {task.id} from its queue, in its own session and worktree", task.id

    def merged_worktree_line(self, worker: Worker) -> str:
        if not worker.worktree:
            return ""
        clashing = self.branch.rebased_onto_branch(worker)
        if clashing:
            return f"its worktree stays as it was, since {clashing}"
        return f"its worktree {self.branch.folder(worker)} stays, moved up to this branch, for its next job"

    def merge_gate(self, event: WorkerMerging) -> None:
        refusals = self.events.worker_merging(event)
        if refusals:
            reasons = "\n".join(refusals)
            raise Rejection(f"worker {event.worker}'s work was not merged: a plugin held it\n{reasons}")

    def merged_tasks(self, worker: Worker) -> tuple[Task, ...]:
        worker_tasks = tuple(self.tasks.find(task_id) for task_id in self.merged_task_ids(worker))
        proved = tuple(task for task in worker_tasks if self.latest_proofs(task))
        owned = proved or worker_tasks
        if not worker.is_delivered():
            return self.checked_tasks(worker, owned)
        refusals = [line for task in owned if (line := self.unchecked_refusal(worker, task, "" if task is owned[-1] else f" --task {task.id}"))]
        if refusals:
            raise Rejection("; ".join(refusals))
        return owned

    def checked_tasks(self, worker: Worker, owned: tuple[Task, ...]) -> tuple[Task, ...]:
        checked = tuple(task for task in owned if not self.unchecked_points(task))
        if not checked:
            raise Rejection(f"no task of worker {worker.id} is fully checked: `journal worker check {worker.id} <point> --task <task>` first")
        return checked

    def release_rest(self, worker: Worker, actor: Actor) -> None:
        if not worker.is_delivered() or not self.unproved_task_ids(worker):
            self.tasks.release(Ref.build(worker), actor)
        if not worker.is_delivered():
            self.tasks.unqueued(Ref.build(worker), actor)

    def unproved_task_ids(self, worker: Worker) -> list[int]:
        return [task_id for task_id in self.tasks.holder_task_ids(Ref.build(worker)) if not self.latest_proofs(self.tasks.find(task_id))]

    def mergeable(self, n: int, purpose: str) -> Worker:
        worker = self.workers.find(n)
        if worker.state not in MERGEABLE_STATES:
            raise Rejection(f"worker {worker.id} is {worker.state}: only a worker that has ended has {purpose}")
        return worker

    def delivered(self, n: int, purpose: str) -> Worker:
        worker = self.workers.find(n)
        if not worker.is_delivered():
            raise Rejection(f"worker {worker.id} is {worker.state}: only a worker that clocked out has {purpose}")
        return worker

    def worker_task(self, worker: Worker) -> Task:
        return self.tasks.find(self.tasks.holder_task_ids(Ref.build(worker))[0])

    def release(self, n: int, actor: Actor) -> Worker:
        finished = self.tasks.finished_task_ids(Ref.build(self.workers.find(n)))
        if finished:
            raise Rejection(f"worker {n} completed {', '.join(f'task {task_id}' for task_id in finished)}, waiting for the merge: merge them, or release with --drop")
        return self.release_dropping(n, actor)

    def release_dropping(self, n: int, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.workers.find(n)
            if worker.is_running():
                raise Rejection(f"worker {worker.id}, {worker.name}, is still out: stop it first with journal worker stop {worker.id}")
            self.tasks.release_all(Ref.build(worker), actor)
            return self.workers.save(worker.released(self.time_source.moment().timestamp()), actor)

    def relaunch(self, worker: Worker, brief: str, dispatcher: str | None, actor: Actor, move: str, reused: type[WorkerReused] = WorkerReused, task: Task | None = None) -> Worker:
        revival = worker.state == WorkerState.STOPPED or self.runner.is_ended(worker)
        if self.runner.is_ended(worker):
            worker = self.runner.recorded_end(worker, actor)
        self.resumable(worker)
        brief = self.rebase_note(worker) + (EDITED_NOTE.format(task=worker.edited_task) if worker.edited_task else "") + brief
        repositories = self.renewal(worker, brief)
        moved, time = worker.with_(dispatcher=worker.dispatcher if dispatcher is None else dispatcher, repositories=repositories, edited_task=0), self.time_source.moment().timestamp()
        busy = self.is_session_busy(worker)
        if task:
            self.assigner.handed(worker, task, actor)
        if busy:
            self.inbox.deliver(worker.pid, worker.resume, "the agent that dispatched you", brief)
            return self.workers.save(moved.redirected(brief, time, reused, move), actor)
        worker = self.workers.save(moved.resumed(brief, time, WorkerRevived if revival else reused, move), actor)
        self.runner.start(worker, actor)
        return worker

    def is_session_busy(self, worker: Worker) -> bool:
        if not worker.pid or not self.runner.is_running(worker.pid):
            return False
        if not self.providers.lookup(worker.provider).session_inbox:
            raise Rejection(SESSION_BUSY_REFUSAL.format(n=worker.id, provider=worker.provider.capitalize()))
        return True

    def resumable(self, worker: Worker) -> None:
        if worker.is_running():
            raise Rejection(f"worker {worker.id}, {worker.name}, is still out: `journal worker notify {worker.id} \"<text>\"`, or wait")
        if not worker.resume:
            raise Rejection(f"worker {worker.id}, {worker.name}, left no session to resume: dispatch the job again")
        if self.providers.lookup(worker.provider).transcript(self.branch.place(worker), worker.resume) is None:
            raise Rejection(f"worker {worker.id}, {worker.name}: its session {worker.resume} is gone; dispatch the job again")

    def rebase_note(self, worker: Worker) -> str:
        start_heads = self.branch.worktree_heads(worker)
        clashing = self.branch.rebased_onto_branch(worker)
        if clashing:
            return REBASE_NOTE.format(heads=self.branch.project_heads(worker), clashing=clashing)
        return MOVED_NOTE.format(heads=self.branch.project_heads(worker)) if self.branch.worktree_heads(worker) != start_heads else ""

    def renewal(self, worker: Worker, brief: str) -> tuple[str, ...]:
        try:
            return self.runner.renewed(worker, brief)
        except WorktreeFailure as failed:
            raise Rejection(f"worker {worker.name} was not sent the job: {failed}") from failed

    def user_message(self, n: int, text: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            worker = self.workers.find(n)
            if worker.is_running():
                return self.notified(worker, text, "the user", actor)
            return self.relaunch(worker, text, None, actor, JOB_MOVE)

    def notify(self, n: int, text: str, actor: Actor) -> Worker:
        with self.runner.lock(n):
            return self.notified(self.workers.find(n), text, "the agent that dispatched you", actor)

    def notified(self, worker: Worker, text: str, sender: str, actor: Actor) -> Worker:
        refusal = self.notify_refusal(worker)
        if refusal:
            raise Rejection(refusal.format(n=worker.id, name=worker.name, provider=worker.provider.capitalize()))
        self.inbox.deliver(worker.pid, worker.resume, sender, text)
        return self.workers.save(worker.notified(text, self.time_source.moment().timestamp(), actor.stamp), actor)

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
            worker = self.workers.save(self.workers.find(n).stopped(self.time_source.moment().timestamp(), reason), actor)
            self.runner.stop(worker)
            return worker

    def complete(self, n: int, reason: str, actor: Actor) -> tuple[Worker, str]:
        unmerged = self.branch.unmerged_count(self.workers.find(n))
        if unmerged:
            raise Rejection(f"worker {n} has {unmerged} unmerged commits: merge them, or `journal worker discard {n}`")
        return self.retired(n, reason, actor)

    def discard(self, n: int, reason: str, actor: Actor) -> tuple[Worker, str]:
        return self.retired(n, f"its work thrown away: {reason}", actor)

    def retired(self, n: int, reason: str, actor: Actor) -> tuple[Worker, str]:
        with self.runner.lock(n):
            worker = self.workers.save(self.workers.find(n).finished(self.time_source.moment().timestamp(), reason), actor)
            self.runner.stop(worker)
            self.tasks.release(Ref.build(worker), actor)
        return worker, self.branch.dropped(worker)
