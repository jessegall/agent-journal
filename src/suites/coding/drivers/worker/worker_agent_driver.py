from suites.coding.drivers.coding_rank_orders import CODING_HELPER_RANK_ORDER
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from suites.coding.support.context_line import CONTEXT_LINE
from suites.coding.support.worker_test_rule import WORKER_TEST_RULE


class WorkerAgentDriver(Driver):
    """The coding suite's driver of a worker: its unit refuses a stop while work remains and its parent
    answers its escalations; its modules declare its contributions."""

    name = "coding.worker"
    agent_type = "worker"
    suite = "coding"
    rank_order = CODING_HELPER_RANK_ORDER
    work_stop = WorkStop.REFUSE_DURING_WORK
    responder = Responder.PARENT
    instructions = ["You are a worker: you do your tasks in your worktree, prove each point with journal proof make, start another task with journal task start and commit your work with journal worker commit; journal handles git.",
                    WORKER_TEST_RULE, CONTEXT_LINE]
