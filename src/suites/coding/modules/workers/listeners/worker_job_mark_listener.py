from core.base.change.logged_event import LoggedEvent
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.support.merger_nudges import MERGER_FINDINGS_PREFIX
from suites.coding.modules.workers.support.worker_recipient import WorkerRecipient
from core.base.change.created import Created


class WorkerJobMarkListener(MarkListener[Created[Message]]):
    """A worker that is sent its next job shows as a mark in the chat naming the worker, with the job shown on
    opening it and a click that opens the worker."""

    name = "workers.job-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        if logged.command != SendWorker.label():
            return
        message = event.row
        if not WorkerRecipient.matches_worker(message.recipient):
            return
        worker = self.event_rows.required(Agent, WorkerRecipient.worker_id(message.recipient))
        name = worker.given_name or f"Worker {worker.id}"
        findings = message.text.startswith(MERGER_FINDINGS_PREFIX)
        text = f"The merger sent {name} back" if findings else f"{name} was sent its next job"
        detail = message.text[len(MERGER_FINDINGS_PREFIX):] if findings else message.text
        self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.NEXT_JOB, text, None, AGENTS_TABLE, worker.id, detail=detail)
