from engine.enums.agent_kind import AgentKind
from engine.module.default_state import DefaultState
from suites.coding.modules.workers.states.worker_log_due import WorkerLogDue
from suites.coding.modules.workers.types.worker import Worker


class WorkerLogDueDefault(DefaultState):
    """Every worker of the coding suite keeps its task log up to date."""

    state = WorkerLogDue
    kind = AgentKind.HELPER_TYPE
    value = Worker.key
