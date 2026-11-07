from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.lifecycles.worker_test_request_lifecycle import WorkerTestRequestLifecycle
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


class WorkerTestRequestMarkListener(MarkListener[Created[WorkerTestRequest] | Moved[WorkerTestRequest]]):
    """Shows a worker's test request and its approval in the chat."""

    name = "workers.test-request-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"
    moves = tuple([WorkerTestRequestLifecycle.allow])

    def handle(self, event: Created[WorkerTestRequest] | Moved[WorkerTestRequest], logged: LoggedEvent) -> None:
        request = event.row
        worker = self.event_rows.required(Agent, request.worker_id)
        name = worker.given_name or f"Worker {worker.id}"
        if isinstance(event, Created):
            variant = WorkerMarkVariant.TEST_REQUEST
            text = f"{name} asks to run a test"
        else:
            variant = WorkerMarkVariant.TEST_ALLOWED
            text = f"{name} may run the test"
        detail = f"Command: {request.command}\nReason: {request.reason}"
        self.show(logged, WorkerMarkType.WORKER, variant, text, None, AGENTS_TABLE, worker.id, detail=detail)
