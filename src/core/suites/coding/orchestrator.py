from core.base.driver.driver import Driver
from core.suites.coding.open_task_stop_refusal import OpenTaskStopRefusal
from core.suites.coding.orchestrator_start_guard import OrchestratorStartGuard


class Orchestrator(Driver):
    """Drives the coding suite's main agent as the orchestrator, which gives every task to a worker."""

    name = "coding.orchestrator"
    suite = "coding"
    role = "main"
    rules = [OpenTaskStopRefusal]
    guards = [OrchestratorStartGuard]
    opening_lines = ["You are the orchestrator: you plan the work, give each task to a worker and check what comes back; you start no task yourself"]
