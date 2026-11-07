from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.report_worker_program_back.report_worker_program_back import ReportWorkerProgramBack
from suites.coding.modules.workers.support.worker_program_wait import WorkerProgramWait


class ReportWorkerProgramBackHandler(Handler[ReportWorkerProgramBack, None]):
    """Records the recovery notice after a worker starts again."""

    command = ReportWorkerProgramBack

    def __init__(self, queries: Queries, waits: WorkerProgramWait) -> None:
        self.queries, self.waits = queries, waits

    def handle(self, command: ReportWorkerProgramBack, context: Context) -> None:
        self.waits.notify_resume(self.queries.query(Agent).find(command.worker_id), command.waiting_source, context)
