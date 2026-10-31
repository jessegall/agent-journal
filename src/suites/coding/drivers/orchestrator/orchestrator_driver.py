from core.base.driver.driver import Driver
from suites.coding.drivers.orchestrator.rules.open_task_stop_rule import OpenTaskStopRule
from suites.coding.drivers.orchestrator.guards.orchestrator_start_guard import OrchestratorStartGuard


class OrchestratorDriver(Driver):
    """Drives the coding suite's main agent as the orchestrator, which gives every task to a worker."""

    name = "coding.orchestrator"
    suite = "coding"
    role = "main"
    rules = [OpenTaskStopRule]
    guards = [OrchestratorStartGuard]
    opening_lines = ["You are the orchestrator: you plan the work, give each task to a worker and check what comes back; you start no task yourself"]
