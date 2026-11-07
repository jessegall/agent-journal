from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from suites.coding.modules.workers.commands.allow_worker_test.allow_worker_test import AllowWorkerTest
from suites.coding.modules.workers.models.enums.worker_test_request_state import WorkerTestRequestState
from suites.coding.modules.workers.models.lifecycles.worker_test_request_lifecycle import WorkerTestRequestLifecycle
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TEST_ALLOWED


class AllowWorkerTestHandler(Handler[AllowWorkerTest, WorkerTestRequest]):
    """Allows a request that was asked, for the main agent of the worker's environment or a person only, logs it
    on the task and tells the worker."""

    command = AllowWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger, bus: Bus) -> None:
        self.queries, self.repository, self.nudger, self.bus = queries, repository, nudger, bus

    def handle(self, command: AllowWorkerTest, context: Context) -> WorkerTestRequest:
        request = self.queries.query(WorkerTestRequest).find(command.request_id)
        self.verify_allowed(request, context.actor)
        if request.state is not WorkerTestRequestState.REQUESTED:
            raise Refusal(f"request {request.id} is already {request.state}", "journal worker-test-request list shows the requests")
        allowed = self.repository.save_change(request, request.moved(WorkerTestRequestLifecycle.allow), context)
        self.bus.dispatch(MakeTaskLog(request.task_id, f"{context.actor.type} {context.actor.id} allowed the run of request {request.id}"), context)
        self.nudger.send(request.worker_id, WORKER_TEST_ALLOWED, WORKER_JOB_SOURCE, context, request=request.id)
        return allowed

    def verify_allowed(self, request: WorkerTestRequest, actor: Actor) -> None:
        worker = self.queries.query(Agent).find(request.worker_id)
        if actor.type is ActorType.USER or actor.id == worker.parent_id:
            return
        caller = self.queries.query(Agent).find(actor.id)
        if caller.role != AgentRole.MAIN or caller.environment_id != worker.environment_id:
            raise Refusal(f"only the main agent of worker {request.worker_id} or a person allows request {request.id}")
