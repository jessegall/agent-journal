from journal.support.actor import Actor
from collections.abc import Callable
from datetime import datetime, timezone
from journal.db.connection import Connection
from journal.db.query import Query
from journal.events.bus import Bus
from journal.models.agent import Agent
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.links import Links
from journal.repositories.rows import Rows
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import Tasks
from journal.support.time_source import TimeSource




class Workers(ScopedRepository[Worker]):
    model = Worker

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, rows: Rows, tasks: Tasks, time_source: TimeSource) -> None:
        super().__init__(connection, bus, scope, time_source)
        self.links, self.rows, self.tasks = links, rows, tasks

    def open_workers(self) -> list[Worker]:
        return self.selected(self.query().filter_listed("state", [WorkerState.DISPATCHED, WorkerState.READY, WorkerState.DELIVERED, WorkerState.UNFINISHED]).filter(adopted=False).order("id"))

    def mark_silence(self, worker: Worker, time: float, actor: Actor) -> None:
        with self.connection.transaction():
            current = self.find(worker.row_id)
            if current.is_silent(time):
                self.save(current.silence_noted(time), actor)

    def numbered(self, n: int) -> list[Worker]:
        return self.selected(self.query().filter(id=n))

    def running_workers(self) -> list[Worker]:
        return self.selected(self.dispatched_query().order("id"))

    def dispatcher_workers(self, session: str) -> list[Worker]:
        return self.selected(self.dispatched_query().filter(dispatcher=session).order("id"))

    def all_dispatched(self) -> list[Worker]:
        return self.selected_globally(self.dispatched_query().order("id"))

    def dispatched_count(self) -> int:
        return self.counted(self.dispatched_query())

    def dispatched_query(self) -> Query:
        return self.query().filter_listed("state", [WorkerState.DISPATCHED, WorkerState.READY])

    def with_worktree(self) -> list[Worker]:
        return self.selected(self.query().filter(worktree=True).order("id"))

    def rebase_candidates(self, dispatcher: str) -> list[Worker]:
        return self.selected(self.query().filter(worktree=True, dispatcher=dispatcher).filter_listed("state", [WorkerState.DISPATCHED, WorkerState.READY, WorkerState.DELIVERED, WorkerState.UNFINISHED, WorkerState.REPORTED]).order("id"))

    def idle_workers(self) -> list[Worker]:
        return self.selected(self.idle_query().with_columns("name", "profile", "touched_paths", "state", "adopted", "dispatcher").order("id"))

    def idle_query(self) -> Query:
        return self.query().filter(state=WorkerState.REPORTED, adopted=False)

    def unfinished_accepted(self, dispatcher: str, accepts: Callable[[Worker], bool]) -> list[Worker]:
        return [worker for worker in self.matching(state=WorkerState.UNFINISHED, dispatcher=dispatcher) if accepts(worker)]

    def unreviewed_deliveries(self) -> list[Worker]:
        return self.selected(self.query().filter(state=WorkerState.DELIVERED, review_pending=False).order("id"))

    def queued_reviews(self) -> list[Worker]:
        return self.selected(self.query().filter(state=WorkerState.DELIVERED, review_pending=True).filter_greater("review_queued_at", 0).order("review_queued_at"))

    def limit_passed(self, time: float) -> list[Worker]:
        return self.selected_globally(self.query().filter(state=WorkerState.LIMITED).filter_less_equal("resumes_at", time).order("id"))

    def changed_since(self, time: float) -> list[Worker]:
        return self.selected(self.query().filter_greater_equal("updated_at", datetime.fromtimestamp(time, timezone.utc)).order("id"))

    def recently_merged(self, time: float) -> list[Worker]:
        return self.selected(self.query().filter_greater("merged_at", time).order("merged_at"))

    def delivered_workers(self, dispatcher: str) -> list[Worker]:
        return self.selected(self.query().filter(state=WorkerState.DELIVERED, dispatcher=dispatcher).filter_unequal("review_pending", True).order("id"))

    def checkable_workers(self) -> list[Worker]:
        return self.selected(self.query().filter(state=WorkerState.DELIVERED).filter_unequal("review_pending", True).order("id"))

    def busy_workers(self) -> list[Worker]:
        return [*self.running_workers(), *self.checkable_workers()]

    def peers(self, sender: Worker) -> list[Worker]:
        return [worker for worker in self.scoped() if worker.dispatcher == sender.dispatcher and worker.id != sender.id and (worker.is_running() or worker.is_idle())]

    def active(self) -> list[Worker]:
        return self.matching(state=WorkerState.DISPATCHED)

    def containing(self, task_ids: set[int]) -> dict[int, Worker]:
        holdings = self.tasks.task_worker_holdings(task_ids)
        rows = {worker.id: worker for worker in self.selected_globally(self.query().filter_listed("id", sorted(set(holdings.values()))))} if holdings else {}
        return {task: rows[worker] for task, worker in holdings.items() if worker in rows}

    def agent_holder(self, agent: Agent) -> Ref:
        rows = self.session_worker(agent.session) if agent.role.is_helper() else []
        return Ref.build(rows[0]) if rows else Ref.build(agent)

    def session_worker(self, session: str | None) -> list[Worker]:
        if not session:
            return []
        rows = {w.id: w for query in (self.query().filter(session=session), self.query().filter(resume=session)) for w in self.selected(query)}
        return [rows[n] for n in sorted(rows)]
