from core.base.change.logged_event import LoggedEvent
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.support.worker_recipient import WorkerRecipient


class WorkerJobMarkListener(MarkListener):
    """A worker that is sent its next job shows as a mark in the chat naming the worker, with the job shown on
    opening it and a click that opens the worker."""

    name = "workers.job-mark"
    event = "message.create"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: LoggedEvent) -> None:
        if event.command != SendWorker.label():
            return
        message = self.queries.query(Message).find(event.row_id)
        if not WorkerRecipient.is_for_worker(message.recipient):
            return
        worker = self.queries.query(Agent).find(WorkerRecipient.worker_id(message.recipient))
        name = worker.given_name or f"Worker {worker.id}"
        self.show(event, WorkerMarkType.WORKER, WorkerMarkVariant.NEXT_JOB, f"{name} was sent its next job", worker.environment_id, None, AGENTS_TABLE, worker.id, detail=message.text)
