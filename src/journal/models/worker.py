from typing import ClassVar
from dataclasses import dataclass
from journal.models.support.worker_moves import WorkerMoves
from journal.models.support.worker_silence import WorkerSilence
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.worker_reported import WorkerReported
from journal.events.rows.worker_test_failed import WorkerTestFailed
from journal.events.rows.worker_spent import WorkerSpent
from journal.models.model_tier import ModelTier
from journal.events.rows.worker_keeps_clashing import WorkerKeepsClashing
from journal.events.rows.worker_rebased import WorkerRebased
from journal.events.rows.worker_model_judged import WorkerModelJudged
from journal.events.rows.worker_model_mismatch import WorkerModelMismatch
from journal.models.support.model_fit import ModelFit
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.events.rows.worker_stopped import WorkerStopped
from journal.events.rows.worker_memory_warning import WorkerMemoryWarning
from journal.events.rows.worker_ready import WorkerReady
from journal.events.rows.worker_delivered import WorkerDelivered
from journal.events.rows.worker_review_failed import WorkerReviewFailed
from journal.events.rows.worker_reviewed import WorkerReviewed
from journal.events.rows.worker_review_undecided import WorkerReviewUndecided
from journal.events.rows.worker_queue_empty import WorkerQueueEmpty
from journal.events.rows.worker_review_requested import WorkerReviewRequested
from journal.events.rows.worker_merged import WorkerMerged
from journal.events.rows.worker_released import WorkerReleased
from journal.events.rows.worker_limited import WorkerLimited
from journal.events.rows.worker_silent import WorkerSilent
from journal.events.rows.worker_queue_turn_ended import WorkerQueueTurnEnded
from journal.events.rows.worker_unfinished import WorkerUnfinished
from journal.events.rows.worker_notified import WorkerNotified
from journal.events.rows.worker_retired import WorkerRetired
from journal.events.rows.worker_reused import WorkerReused
from journal.events.rows.worker_revived import WorkerRevived
from journal.events.rows.worker_auto_dispatched import WorkerAutoDispatched
from journal.events.rows.worker_queue_drained import WorkerQueueDrained
from journal.models.helper import Helper
from journal.models.reviewer import Reviewer
from journal.models.support.path_overlap import PathOverlap
from journal.models.worker_state import WorkerState
from journal.support.rejection import Rejection
from journal.support.timeout import Timeout

SILENCE = Timeout.minutes(10)
ENDED_UNFINISHED = "ended without clocking out"
QUEUE_TURN_END = "ended mid-queue"
# how a run that went past the time limit says it was stopped
RUN_LIMIT_END = "stopped after"
# how a run whose agent never started its session says it ended, and the move that launches the job once more after the first such run
STALLED_START_END = "never started"
START_RETRY_MOVE = "launched again after a stalled start"
LIMITED_MOVE = "stopped at the usage limit"
RUN_LIMIT_REASON = "run limit"
# the move that hands a worker a point back, the one that takes its work in, and its clock-out
REJECTION_MOVE, MERGED, DELIVERY_MOVE = "sent back", "merged", "clocked out"
# the moves that start a job, and the move to the next task of a queue inside it
JOB_MOVE = "sent a job"
JOB_STARTS = ("dispatched", JOB_MOVE)
QUEUE_MOVE = "moved on to task"


@dataclass(frozen=True)
class Worker(Helper):
    """An agent sent to write one bounded job, in a worktree of its own when it changes code: out while dispatched whatever its process, so one ended unreported or mid-report still counts as out until its report is filed; idle once it reported, until its report is acted on; in review while the journal's reviewer reviews what it clocked out with, and queued for review from its clock-out until a reviewer takes it; retired once stopped or acted on. It keeps each move it made with its time, how many of its test runs in a row have failed, how its merged work fit the model it ran on, what its runs have cost in dollars, when its work was last merged and for which task, when it goes on by itself after stopping at the usage limit, the branch it commits on, and, for one sent to the team's pool, the team server's number of the request that asked for it and the branch on origin its worktree is cut from. Its job began at its dispatch or at a job sent to it; a move to the next task of its queue is the same job going on."""

    text_fields: ClassVar[tuple[str, ...]] = ("name", "brief")
    unshown_fields: ClassVar[tuple[str, ...]] = ("transcript_bytes",)
    helper_type: str = "worker"
    profile: str | None = None
    worktree: bool = False
    repositories: tuple[str, ...] = ()
    library_links: tuple[str, ...] = ()
    library_copies: tuple[str, ...] = ()
    state: WorkerState = WorkerState.DISPATCHED
    dispatcher: str | None = None
    resume: str = ""
    adopted: bool = False
    began: float = 0.0
    recovered_session: str = ""
    touched_paths: tuple[str, ...] | None = None
    reuse_count: int = 0
    retire_reason: str = ""
    run_end: str = ""
    transcript_bytes: int = 0
    silence: WorkerSilence = WorkerSilence(SILENCE)
    moves: WorkerMoves = WorkerMoves()
    branch: str = ""
    edited_task: int = 0
    review_pending: bool = False
    failing_runs: int = 0
    model_fit: ModelFit = ModelFit()
    review_queued_at: float = 0.0
    merged_at: float = 0.0
    merged_task: int = 0
    resumes_at: float = 0.0
    cost_dollars: float = 0.0
    clashes: int = 0
    rebase_due: bool = False
    edit_lock: bool = False

    def conversation(self) -> str:
        return self.resume or self.session or self.recovered_session

    def mention(self) -> WorkerMention:
        return WorkerMention(self.row_id, self.name, self.dispatcher, self.session)

    def dispatched(self, time: float) -> "Worker":
        return self.contacted(time).moved("dispatched", time).with_(state=WorkerState.DISPATCHED).with_event(self.pending(WorkerDispatched, time))

    def auto_dispatched(self, time: float) -> "Worker":
        return self.contacted(time).moved("dispatched", time).with_(state=WorkerState.DISPATCHED).with_event(WorkerAutoDispatched(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), label=self.mention().label(), awaiter=None, brief=self.brief))

    def pending(self, type_name: type[WorkerDispatched], time: float) -> WorkerDispatched:
        return type_name(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), label=self.mention().label(), awaiter=self.dispatcher, brief=self.brief)

    def reported(self, time: float, report: int) -> "Worker":
        return self.contacted(time).moved("reported", time).with_(state=WorkerState.REPORTED, adopted=False, pid=0).with_event(WorkerReported(environment_id=self.environment_id, time=time, worker=self.mention(), report=report, ref=self.mention().ref(), outcome=f"{self.mention().title()}, reported"))

    def failed_run(self, failed: int, time: float) -> "Worker":
        runs = self.failing_runs + 1
        return self.with_(failing_runs=runs).with_event(WorkerTestFailed(environment_id=self.environment_id, time=time, worker=self.mention(), failed=failed, runs=runs))

    def spent(self, cost: float, tier: ModelTier, profile_tier: ModelTier, time: float) -> "Worker":
        total = self.cost_dollars + cost
        return self.with_(cost_dollars=total).with_event(WorkerSpent(environment_id=self.environment_id, time=time, worker=self.mention(), model=self.model, tier=tier, profile_tier=profile_tier, before_dollars=self.cost_dollars, cost_dollars=total))

    def delivery_time(self) -> float:
        return next((time for word, time in reversed(self.moves.steps) if word == DELIVERY_MOVE), 0.0)

    def job_start_time(self) -> float:
        return next((time for word, time in reversed(self.moves.steps) if word in JOB_STARTS), 0.0)

    def rejections(self) -> int:
        return self.moves.recent_count(REJECTION_MOVE, MERGED)

    def model_measured(self, fit: ModelFit, rejections: int, time: float) -> "Worker":
        measured = self.with_(model_fit=fit)
        if not fit.is_mismatch():
            return measured
        return measured.with_event(WorkerModelMismatch(environment_id=self.environment_id, time=time, worker=self.mention(), fit=fit.measured, model=self.model, points=fit.points, rejections=rejections))

    def model_judged(self, verdict: str, reason: str, verifier_session: str, time: float) -> "Worker":
        return self.with_(model_fit=self.model_fit.judged(verdict, reason)).with_event(WorkerModelJudged(environment_id=self.environment_id, time=time, worker=self.mention(), verdict=verdict, reason=reason, verifier_session=verifier_session))

    def rebased(self, outcome: str, time: float) -> "Worker":
        return self.with_(rebase_due=False, edit_lock=False).with_event(WorkerRebased(environment_id=self.environment_id, time=time, worker=self.mention(), outcome=outcome))

    def clashed(self, clashing: str, limit: int, time: float) -> "Worker":
        worker = self.with_(clashes=self.clashes + 1)
        return worker.with_event(WorkerKeepsClashing(environment_id=self.environment_id, time=time, worker=self.mention(), clashes=worker.clashes, clashing=clashing)) if 0 < limit <= worker.clashes else worker

    def passed_run(self) -> "Worker":
        return self.with_(failing_runs=0)

    def queue_drained(self, task_ids: list[int], time: float) -> "Worker":
        return self.with_event(WorkerQueueDrained(environment_id=self.environment_id, time=time, worker=self.mention(), tasks=f"tasks {', '.join(map(str, task_ids))} are open again"))

    def ready(self, time: float) -> "Worker":
        return self.contacted(time).moved("clocked in", time).with_(state=WorkerState.READY).with_event(WorkerReady(environment_id=self.environment_id, time=time, worker=self.mention()))

    def delivered(self, time: float) -> "Worker":
        return self.contacted(time).moved(DELIVERY_MOVE, time).with_(state=WorkerState.DELIVERED).with_event(WorkerDelivered(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, clocked out"))

    def review_requested(self, time: float, report: str) -> "Worker":
        return self.contacted(time).moved(DELIVERY_MOVE, time).with_(state=WorkerState.DELIVERED, review_pending=True, review_queued_at=time).with_event(WorkerReviewRequested(environment_id=self.environment_id, time=time, worker=self.mention(), report=report))

    def reviewed(self, time: float, task: int, reviewer: Reviewer, report: str) -> "Worker":
        return self.review_ended(time, "reviewed").with_event(WorkerReviewed(environment_id=self.environment_id, time=time, worker=self.mention(), task=task, reviewer=reviewer.id, reviewer_session=reviewer.session, report=report))

    def review_undecided(self, time: float, task: int, reviewer: Reviewer, report: str) -> "Worker":
        return self.reviewed(time, task, reviewer, report).with_event(WorkerReviewUndecided(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, its review left for you to decide", task=task, reviewer=reviewer.id, report=report))

    def queue_emptied(self, time: float) -> "Worker":
        return self.with_event(WorkerQueueEmpty(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, merged, with no work left"))

    def review_failed(self, time: float, task: int) -> "Worker":
        return self.review_ended(time, "review ended without a report").with_event(WorkerReviewFailed(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, its review ended without a report", task=task))

    def review_claimed(self) -> "Worker":
        return self.with_(review_queued_at=0.0)

    def review_ended(self, time: float, move: str) -> "Worker":
        if not self.review_pending:
            raise Rejection(f"worker {self.id} has no work in review")
        return self.contacted(time).moved(move, time).with_(review_pending=False, review_queued_at=0.0)

    def unfinished(self, time: float, text: str) -> "Worker":
        attempts = sum(1 for word, _ in self.moves.steps if word == ENDED_UNFINISHED) + 1
        return self.moved(ENDED_UNFINISHED, time).with_(state=WorkerState.UNFINISHED, pid=0, token_hash="", run_end=text).with_event(WorkerUnfinished(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, ended without clocking out", times=attempts, is_run_limit=text.startswith(RUN_LIMIT_END), is_stalled_start=text.startswith(STALLED_START_END)))

    def limited(self, time: float, resumes_at: float, text: str) -> "Worker":
        return self.moved(LIMITED_MOVE, time).with_(state=WorkerState.LIMITED, pid=0, token_hash="", run_end=text, resumes_at=resumes_at).with_event(WorkerLimited(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, waiting for the usage limit", resumes_at=resumes_at))

    def start_retried(self, resume: str, time: float) -> "Worker":
        return self.moved(START_RETRY_MOVE, time).with_(resume=resume, pid=0, began=0.0)

    def is_start_retried(self) -> bool:
        return self.moves.latest((START_RETRY_MOVE, *JOB_STARTS, QUEUE_MOVE, REJECTION_MOVE)) == START_RETRY_MOVE

    def queue_turn_ended(self, time: float, task: int) -> "Worker":
        return self.moved(QUEUE_TURN_END, time).with_(state=WorkerState.UNFINISHED, pid=0, token_hash="").with_event(WorkerQueueTurnEnded(environment_id=self.environment_id, time=time, worker=self.mention(), task=task))

    def merged(self, task: int, time: float) -> "Worker":
        return self.moved(MERGED, time).with_(state=WorkerState.MERGED, token_hash="", merged_at=time, merged_task=task, clashes=0).with_event(WorkerMerged(environment_id=self.environment_id, time=time, worker=self.mention()))

    def released(self, time: float) -> "Worker":
        return self.moved("released", time).with_(state=WorkerState.RELEASED, token_hash="").with_event(WorkerReleased(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, released"))

    def running_as(self, pid: int, began: float) -> "Worker":
        return self.with_(pid=pid, began=began, recovered_session="")

    def resumed(self, brief: str, time: float, type_name: type[WorkerReused] | type[WorkerRevived], move: str) -> "Worker":
        instructed = self.instructed(brief, time).moved(move, time).with_(reuse_count=self.reuse_count + 1)
        return instructed.with_event(instructed.pending(type_name, time))

    def redirected(self, brief: str, time: float, type_name: type[WorkerReused] | type[WorkerRevived], move: str) -> "Worker":
        return self.resumed(brief, time, type_name, move).with_(pid=self.pid, began=self.began)

    def instructed(self, brief: str, time: float) -> "Worker":
        return self.contacted(time).with_(brief=brief, state=WorkerState.DISPATCHED, adopted=False, pid=0, began=0.0, review_pending=False, review_queued_at=0.0)

    def moved(self, move: str, time: float) -> "Worker":
        return self.with_(moves=self.moves.added(move, time))

    def queue_advanced(self, task: int, time: float) -> "Worker":
        return self.moved(f"{QUEUE_MOVE} {task}", time).with_(began=time)

    def is_queue_advanced(self) -> bool:
        return self.moves.latest((QUEUE_MOVE, *JOB_STARTS, REJECTION_MOVE)).startswith(QUEUE_MOVE)

    def contacted(self, time: float) -> "Worker":
        return self.with_(silence=self.silence.started(time))

    def is_silent(self, time: float) -> bool:
        return self.is_running() and (self.silence.is_elapsed(time) or self.silence.is_split_due(time))

    def silence_noted(self, time: float) -> "Worker":
        split = self.silence.is_split_due(time)
        minutes = self.silence.dispatcher_minutes() if split else self.silence.minutes()
        return self.with_(silence=self.silence.named(time)).with_event(WorkerSilent(environment_id=self.environment_id, time=time, worker=self.mention(), minutes=minutes, is_split_due=split))

    def notified(self, text: str, time: float, sender: str) -> "Worker":
        return self.contacted(time).with_event(WorkerNotified(environment_id=self.environment_id, time=time, worker=self.mention(), text=text, sender=sender))

    def memory_warning(self, time: float, megabytes: int, budget_megabytes: int) -> "Worker":
        return self.with_event(WorkerMemoryWarning(environment_id=self.environment_id, time=time, worker=self.mention(), megabytes=megabytes, budget_megabytes=budget_megabytes))

    def stopped(self, time: float, reason: str) -> "Worker":
        return self.moved("stopped", time).with_(state=WorkerState.STOPPED, adopted=True, retire_reason=reason, token_hash="").with_event(WorkerStopped(environment_id=self.environment_id, time=time, worker=self.mention(), ref=self.mention().ref(), outcome=f"{self.mention().title()}, stopped before it reported", is_run_limit=reason == RUN_LIMIT_REASON))

    def finished(self, time: float, reason: str) -> "Worker":
        retired = self.moved("retired", time).with_(adopted=True, retire_reason=reason).with_event(WorkerRetired(environment_id=self.environment_id, time=time, worker=self.mention()))
        return retired.stopped(time, reason) if self.is_running() else retired

    def is_running(self) -> bool:
        return self.state in (WorkerState.DISPATCHED, WorkerState.READY)

    def is_pending(self) -> bool:
        return self.is_running() or self.review_pending

    def is_mid_turn(self) -> bool:
        return bool(self.token_hash) and self.is_running()

    def is_ended_mid_queue(self) -> bool:
        return self.is_unfinished() and bool(self.moves.steps) and self.moves.steps[-1][0] == QUEUE_TURN_END

    def is_active(self) -> bool:
        return self.is_running() or self.is_delivered()

    def is_closed(self) -> bool:
        return self.state in (WorkerState.STOPPED, WorkerState.MERGED, WorkerState.RELEASED, WorkerState.UNFINISHED)

    def is_unanswered(self, time: float, seconds: float, tested_at: float = 0.0) -> bool:
        return self.is_delivered() and not self.review_pending and Timeout.seconds(seconds).started(max(self.silence.timeout.start, tested_at)).is_exceeded(time)

    def is_retirable(self, time: float, seconds: float) -> bool:
        return not self.adopted and not self.is_active() and not self.review_pending and Timeout.seconds(seconds).started(self.moves.last_time()).is_exceeded(time)

    def is_idle(self) -> bool:
        return self.state == WorkerState.REPORTED and not self.adopted

    def overlaps(self, paths: set[str]) -> bool:
        return PathOverlap.exists(self.touched_paths or (), paths)

    def files_line(self) -> str:
        if self.touched_paths is None:
            return "no files known"
        return ", ".join(self.touched_paths) or "no files changed"

    def title_words(self) -> str:
        return self.name

    def summary_line(self) -> str:
        return self.opening_line(self.brief)

    def is_delivered(self) -> bool:
        return self.state == WorkerState.DELIVERED

    def is_dispatched(self) -> bool:
        return self.state == WorkerState.DISPATCHED

    def is_unfinished(self) -> bool:
        return self.state == WorkerState.UNFINISHED
