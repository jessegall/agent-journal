from core.base.command.context import Context
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.helpers.support.program_state import ProgramState
from suites.coding.modules.workers.support.worker_nudges import WORKER_PROGRAM_RESUMED, WORKER_PROGRAM_UNAVAILABLE


class WorkerProgramWait:
    """Notifies a parent once while a program holds a worker and once when it resumes."""

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    @staticmethod
    def source(worker: Agent) -> str:
        stopped_at = worker.ended_at if worker.ended_at is not None else worker.creation_timestamp()
        return f"workers.program-out:{worker.id}:{stopped_at.text}"

    def notify_wait(self, worker: Agent, state: ProgramState, context: Context) -> None:
        source = self.source(worker)
        if worker.parent_id is None or self.queries.query(AgentLine).filter(session_agent_id=worker.parent_id, source=source).exists():
            return
        availability = state.ends_at.text if state.ends_at is not None else "the program is ready"
        self.nudger.send(worker.parent_id, WORKER_PROGRAM_UNAVAILABLE, source, context,
                         worker=worker.id, program=worker.program, availability=availability, reason=state.line)

    def notify_resume(self, worker: Agent, waiting_source: str, context: Context) -> None:
        if worker.parent_id is None:
            return
        notices = self.queries.query(AgentLine).filter(session_agent_id=worker.parent_id)
        if not notices.filter(source=waiting_source).exists() or notices.filter(source=f"{waiting_source}:back").exists():
            return
        self.nudger.send(worker.parent_id, WORKER_PROGRAM_RESUMED, f"{waiting_source}:back", context,
                         worker=worker.id, program=worker.program)
