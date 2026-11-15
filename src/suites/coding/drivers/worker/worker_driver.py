from suites.coding.support.worker_test_rule import WORKER_TEST_RULE
from engine.driver.driver import Driver
from suites.coding.support.coding_suite_name import CODING_SUITE_NAME
from suites.coding.support.context_line import CONTEXT_LINE


class WorkerDriver(Driver):
    """Drives a coding worker at its one task in its own worktree: no git, only the command types its setting
    allows."""

    name = "coding.worker"
    suite_name = CODING_SUITE_NAME
    role = "worker"
    opening_lines = ["You are a worker: you do your tasks in your worktree, prove each point with journal proof make, start another task with journal task start and commit your work with journal worker commit; journal handles git.", WORKER_TEST_RULE, CONTEXT_LINE]
