from journal.features.workers.support.worker_news import WorkerNews
from journal.features.workers.support.worker_resumes import WorkerResumes
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import WorkersOptions
from journal.models.worker import MERGED, REJECTION_MOVE
from journal.repositories.entries import Entries
from journal.repositories.setting_rows import SettingRows
from journal.repositories.workers import Workers
from journal.support.time_source import TimeSource

DISPATCH_MOVE = "dispatched"


class WorkerNewsReader:
    """Reads an orchestrator's worker news: since its last line of it, or over the set seconds before now when it had none, the merges, send-backs and dispatches in the moves of its workers; and what waits on it: work clocked out to check, a report not acted on, a run ended without clocking out the journal does not resume, a worker failing its test runs in a row."""

    def __init__(self, workers: Workers, entries: Entries, settings: SettingRows, resumes: WorkerResumes, time_source: TimeSource) -> None:
        self.workers, self.entries, self.settings, self.resumes, self.time_source = workers, entries, settings, resumes, time_source

    def read(self, session: str) -> WorkerNews:
        since = self.since(session)
        moves = [word for worker in self.workers.changed_since(since) if worker.dispatcher == session for word, time in worker.moves.steps if time >= since]
        return WorkerNews(merged=moves.count(MERGED), sent_back=moves.count(REJECTION_MOVE), dispatched=moves.count(DISPATCH_MOVE), needs=self.needs(session))

    def since(self, session: str) -> float:
        last = self.entries.last_key_moment(session, WorkersNudges.WORKER_NEWS.key)
        return last.seconds if last else self.time_source.seconds() - self.settings.integer(WorkersOptions.DIGEST_SECONDS)

    def needs(self, session: str) -> tuple[str, ...]:
        failing = self.settings.integer(WorkersOptions.FAILING_RUNS)
        return (*(f"worker {worker.id} ready" for worker in self.workers.delivered_workers(session)),
                *(f"worker {worker.id} reported" for worker in self.workers.idle_workers() if worker.dispatcher == session),
                *(f"worker {worker.id} unfinished" for worker in self.workers.unfinished_accepted(session, lambda worker: not self.resumes.is_resumable(worker))),
                *(f"worker {worker.id} failing" for worker in self.workers.dispatcher_workers(session) if failing and worker.failing_runs >= failing))
