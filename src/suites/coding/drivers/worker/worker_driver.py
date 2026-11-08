from core.base.driver.driver import Driver
from suites.coding.coding_suite import CodingSuite
from suites.coding.support.context_line import CONTEXT_LINE
from suites.coding.drivers.worker.rules.worker_command_type_rule import WorkerCommandTypeRule
from suites.coding.drivers.worker.rules.worker_git_rule import WorkerGitRule
from suites.coding.drivers.worker.rules.worker_full_test_run_rule import WorkerFullTestRunRule
from suites.coding.drivers.worker.rules.worker_stop_rule import WorkerStopRule
from suites.coding.drivers.worker.rules.worker_task_start_rule import WorkerTaskStartRule
from suites.coding.support.coding_helper_kind import CodingHelperKind


class WorkerDriver(Driver):
    """Drives a coding worker at its one task in its own worktree: no git, only the command types its setting
    allows."""

    name = "coding.worker"
    suite = CodingSuite
    role = CodingHelperKind.WORKER
    rules = [WorkerFullTestRunRule, WorkerGitRule, WorkerCommandTypeRule, WorkerTaskStartRule, WorkerStopRule]
    opening_lines = ["You are a worker: you do your tasks in your worktree, go on with journal worker next and hand them all in with journal worker deliver; journal handles git.", "Run only the tests of what you changed, never the whole test suite.", "Use python3 for Python commands.", CONTEXT_LINE]
