from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from suites.coding.modules.workers.models.enums.worker_test_request_state import WorkerTestRequestState


class WorkerTestRequestLifecycle(Lifecycle):
    states = WorkerTestRequestState
    initial = [WorkerTestRequestState.ASKED]
    editable = ()
    deletable = ()

    allow = Move("allow", [WorkerTestRequestState.ASKED], WorkerTestRequestState.ALLOWED)
    use = Move("use", [WorkerTestRequestState.ALLOWED], WorkerTestRequestState.USED)
