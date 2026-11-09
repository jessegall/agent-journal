from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from suites.coding.modules.workers.commands.ask_worker_test.ask_worker_test import AskWorkerTest
from suites.coding.modules.workers.models.enums.worker_test_request_state import OPEN_REQUEST_STATES
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_nudges import WORKER_TEST_REQUESTED

REQUEST_LINE_SOURCE = "workers.test-request"


class AskWorkerTestHandler(Handler[AskWorkerTest, WorkerTestRequest]):
    """Saves a worker's request to run one test command, logs it on the task and tells the merger, or the main
    agent with the merger off. The same command asked again while its request is open gives that request and
    sends nothing."""

    command = AskWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, inbox: MergerInbox, bus: Bus) -> None:
        self.queries, self.repository, self.inbox, self.bus = queries, repository, inbox, bus

    def handle(self, command: AskWorkerTest, context: Context) -> WorkerTestRequest:
        matching_requests = self.queries.query(WorkerTestRequest).filter(worker_id=command.worker_id, task_id=command.task_id, command=command.test_command)
        open_request = matching_requests.matching(Among("state", OPEN_REQUEST_STATES)).first()
        if open_request is not None:
            return open_request
        request = self.repository.save(WorkerTestRequest(worker_id=command.worker_id, task_id=command.task_id, command=command.test_command, reason=command.reason), context)
        self.bus.dispatch(MakeTaskLog(command.task_id, f"worker {command.worker_id} asked to run: {command.test_command}. Why: {command.reason}"), context)
        line = WORKER_TEST_REQUESTED.nudge(worker=command.worker_id, task=command.task_id, request=request.id)
        self.inbox.send_nudge(line, REQUEST_LINE_SOURCE, context)
        return request
