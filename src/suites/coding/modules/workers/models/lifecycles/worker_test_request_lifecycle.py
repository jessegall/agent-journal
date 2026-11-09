from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from suites.coding.modules.workers.models.enums.worker_test_request_state import WorkerTestRequestState


class WorkerTestRequestLifecycle(Lifecycle):
    states = WorkerTestRequestState
    initial = [WorkerTestRequestState.REQUESTED]
    editable = ()
    deletable = ()

    allow = Move("allow", [WorkerTestRequestState.REQUESTED], WorkerTestRequestState.ALLOWED)
    use = Move("use", [WorkerTestRequestState.ALLOWED], WorkerTestRequestState.USED)
    restore = Move("restore", [WorkerTestRequestState.USED], WorkerTestRequestState.ALLOWED)
    refuse = Move("refuse", [WorkerTestRequestState.REQUESTED], WorkerTestRequestState.REFUSED)
