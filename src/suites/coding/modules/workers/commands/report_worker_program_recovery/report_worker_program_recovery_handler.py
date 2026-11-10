from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from suites.coding.modules.workers.commands.report_worker_program_recovery.report_worker_program_recovery import ReportWorkerProgramRecovery, WORKER_PROGRAM_RESUMED


class ReportWorkerProgramRecoveryHandler(Handler[ReportWorkerProgramRecovery, None]):
    """Records the recovery notice after a worker starts again."""

    command = ReportWorkerProgramRecovery

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, command: ReportWorkerProgramRecovery, context: Context) -> None:
        worker = self.queries.query(Agent).find(command.worker_id)
        if worker.parent_id is None:
            return
        notices = self.queries.query(AgentLine).filter(session_agent_id=worker.parent_id)
        if not notices.filter(source=command.waiting_source).exists() or notices.filter(source=f"{command.waiting_source}:back").exists():
            return
        self.nudger.send(worker.parent_id, WORKER_PROGRAM_RESUMED, f"{command.waiting_source}:back", context,
                         worker=worker.id)
