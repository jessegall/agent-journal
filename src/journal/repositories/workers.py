from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.agent import Agent
from journal.models.agent_role import AgentRole
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.links import Links
from journal.repositories.rows import Rows
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import Tasks




class Workers(ScopedRepository[Worker]):
    model = Worker

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, rows: Rows, tasks: Tasks) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.rows, self.tasks = links, rows, tasks

    def running_workers(self) -> list[Worker]:
        return [worker for worker in self.scoped() if worker.is_running()]

    def peers(self, sender: Worker) -> list[Worker]:
        return [worker for worker in self.scoped() if worker.dispatcher == sender.dispatcher and worker.id != sender.id and (worker.is_running() or worker.is_idle())]

    def active(self) -> list[Worker]:
        return self.matching(state=WorkerState.DISPATCHED)

    def containing(self, task_ids: set[int]) -> dict[int, Worker]:
        holdings = {task: worker for task, worker in self.tasks.worker_holdings().items() if task in task_ids}
        rows = {worker.id: worker for worker in self.global_matching()} if holdings else {}
        return {task: rows[worker] for task, worker in holdings.items() if worker in rows}

    def agent_holder(self, agent: Agent) -> Ref:
        rows = self.session_worker(agent.session) if agent.role == AgentRole.WORKER else []
        return Ref.build(rows[0]) if rows else Ref.build(agent)

    def session_worker(self, session: str) -> list[Worker]:
        return [w for w in self.scoped() if session and session in (w.session, w.resume)]
