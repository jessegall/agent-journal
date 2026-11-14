from suites.coding.modules.workers.types.worker import Worker
from suites.coding.support.worker_test_rule import WORKER_TEST_RULE
from engine.driver.driver import Driver
from suites.coding.support.coding_suite_name import CODING_SUITE_NAME
from suites.coding.support.context_line import CONTEXT_LINE
from suites.coding.drivers.worker.rules.worker_git_rule import WorkerGitRule
from suites.coding.drivers.worker.rules.worker_full_test_run_rule import WorkerFullTestRunRule
from suites.coding.drivers.worker.rules.worker_task_start_rule import WorkerTaskStartRule


class WorkerDriver(Driver):
    """Drives a coding worker at its one task in its own worktree: no git, only the command types its setting
    allows."""

    name = "coding.worker"
    suite_name = CODING_SUITE_NAME
    role = Worker.key
    rules = [WorkerFullTestRunRule, WorkerGitRule, WorkerTaskStartRule]
    opening_lines = ["You are a worker: you do your tasks in your worktree, prove each point with journal proof make, start another task with journal task start and commit your work with journal worker commit; journal handles git.", WORKER_TEST_RULE, CONTEXT_LINE]
