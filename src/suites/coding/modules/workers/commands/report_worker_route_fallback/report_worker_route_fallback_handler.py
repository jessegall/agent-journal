from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from engine.driver.message_sender import MessageSender
from suites.coding.modules.workers.commands.report_worker_route_fallback.report_worker_route_fallback import ReportWorkerRouteFallback
from suites.coding.modules.workers.agent_messages.worker_route_fallback_message import WorkerRouteFallbackMessage


class ReportWorkerRouteFallbackHandler(Handler[ReportWorkerRouteFallback, None]):
    """Tells a worker's parent when the split replaced an unavailable route."""

    command = ReportWorkerRouteFallback

    def __init__(self, rows: EventRows, message_sender: MessageSender) -> None:
        self.rows, self.message_sender = rows, message_sender

    def handle(self, command: ReportWorkerRouteFallback, context: Context) -> None:
        worker = self.rows.required(Agent, command.worker_id)
        if worker.parent_id is None:
            return
        self.message_sender.send(worker.parent_id, WorkerRouteFallbackMessage.declared(), f"workers.route_fallback:{worker.id}", context,
                         route=command.fallback.route_id, tasks=command.task_text, program=worker.program)
