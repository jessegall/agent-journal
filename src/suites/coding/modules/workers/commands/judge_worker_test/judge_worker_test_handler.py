import shlex

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from suites.coding.modules.workers.commands.allow_worker_test.allow_worker_test import AllowWorkerTest
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.judge_worker_test.judge_worker_test import JudgeWorkerTest
from suites.coding.modules.workers.models.enums.worker_test_request_state import WorkerTestRequestState
from suites.coding.modules.workers.models.lifecycles.worker_test_request_lifecycle import WorkerTestRequestLifecycle
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TEST_REFUSED
from suites.coding.modules.workers.support.worker_test_arguments import FULL_SUITE_REFUSAL, WorkerTestArguments

UNNEEDED_REASON = "the worker still has test runs of its own"


class JudgeWorkerTestHandler(Handler[JudgeWorkerTest, WorkerTestRequest]):
    """Allows a needed run through the same command the main agent uses, and otherwise refuses it with one line
    to the worker and the reason on the task."""

    command = JudgeWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, queries: Queries, repository: Repository, guidance: WorkerGuidance, nudger: Nudger, bus: Bus) -> None:
        self.agents, self.queries, self.repository, self.guidance, self.nudger, self.bus = agents, queries, repository, guidance, nudger, bus

    def handle(self, command: JudgeWorkerTest, context: Context) -> WorkerTestRequest:
        require_merger(self.agents, context)
        request = self.queries.query(WorkerTestRequest).find(command.request_id)
        if request.state is not WorkerTestRequestState.REQUESTED:
            raise Refusal(f"request {request.id} is already {request.state}", "journal worker-test-request list shows the requests")
        reason = self.refusal_reason(command, request)
        if reason is None:
            return self.bus.dispatch(AllowWorkerTest(request.id), context)
        refused = self.repository.save_change(request, request.moved(WorkerTestRequestLifecycle.refuse), context)
        self.bus.dispatch(MakeTaskLog(request.task_id, f"the merger refused the run of request {request.id}: {reason}"), context)
        self.nudger.send(request.worker_id, WORKER_TEST_REFUSED, WORKER_JOB_SOURCE, context, request=request.id, task=request.task_id)
        return refused

    def refusal_reason(self, command: JudgeWorkerTest, request: WorkerTestRequest) -> str | None:
        if command.refusal_reason is not None:
            return command.refusal_reason
        if WorkerTestArguments.is_full_suite(shlex.split(request.command)[1:]):
            return FULL_SUITE_REFUSAL
        return UNNEEDED_REASON if self.guidance.point(request.worker_id).test_runs_available else None
