from engine.command.context import Context
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from engine.driver.nudger import Nudger
from suites.coding.modules.workers.commands.report_worker_program_recovery.report_worker_program_recovery import ReportWorkerProgramRecovery
from suites.coding.modules.workers.support.worker_nudges import WORKER_PROGRAM_UNAVAILABLE


class WorkerProgramWait:
    """Notifies a parent once while a program holds a worker and once when it resumes."""

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    @staticmethod
    def source(worker: Agent) -> str:
        stopped_at = worker.ended_at if worker.ended_at is not None else worker.creation_timestamp()
        return ReportWorkerProgramRecovery.recovery_source(worker.id, stopped_at)

    def notify_wait(self, worker: Agent, context: Context) -> None:
        source = self.source(worker)
        if worker.parent_id is None or self.queries.query(AgentLine).filter(session_agent_id=worker.parent_id, source=source).exists():
            return
        self.nudger.send(worker.parent_id, WORKER_PROGRAM_UNAVAILABLE, source, context,
                         worker=worker.id)

