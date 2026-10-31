from core.base.module.module import Module
from core.suites.coding.builder import Builder
from core.suites.coding.coding_suite import CodingSuite
from core.suites.coding.orchestrator import Orchestrator
from core.suites.coding.orchestrator_start_guard import OrchestratorStartGuard
from core.suites.coding.subagent import Subagent


class CodingModule(Module):
    """Ships the coding suite with its drivers; the modules only coding uses live in its modules folder."""

    name = "journal.suites.coding"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.drivers", "journal.core.tasks", "journal.core.plans", "journal.core.settings"]
    guards = [OrchestratorStartGuard]
    suites = [CodingSuite]
    drivers = [Builder, Orchestrator, Subagent]
