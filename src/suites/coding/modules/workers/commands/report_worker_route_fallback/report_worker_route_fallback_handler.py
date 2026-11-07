from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from suites.coding.modules.workers.commands.report_worker_route_fallback.report_worker_route_fallback import ReportWorkerRouteFallback
from suites.coding.modules.workers.support.worker_nudges import WORKER_ROUTE_FALLBACK


class ReportWorkerRouteFallbackHandler(Handler[ReportWorkerRouteFallback, None]):
    """Tells a worker's parent when the split replaced an unavailable route."""

    command = ReportWorkerRouteFallback

    def __init__(self, rows: EventRows, nudger: Nudger) -> None:
        self.rows, self.nudger = rows, nudger

    def handle(self, command: ReportWorkerRouteFallback, context: Context) -> None:
        worker = self.rows.required(Agent, command.worker_id)
        if worker.parent_id is None:
            return
        self.nudger.send(worker.parent_id, WORKER_ROUTE_FALLBACK, f"workers.route_fallback:{worker.id}", context,
                         route=command.fallback.line, tasks=command.task_text, program=worker.program)
