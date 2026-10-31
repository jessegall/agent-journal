from core.base.driver.driver import Driver
from suites.coding.drivers.worker.rules.worker_command_type_rule import WorkerCommandTypeRule
from suites.coding.drivers.worker.rules.worker_git_rule import WorkerGitRule
from suites.coding.drivers.worker.rules.worker_stop_rule import WorkerStopRule
from suites.coding.drivers.worker.rules.worker_task_start_rule import WorkerTaskStartRule


class WorkerDriver(Driver):
    """Drives a coding worker at its one task in its own worktree: no git, only the command types its setting allows."""

    name = "coding.worker"
    suite = "coding"
    role = "worker"
    permanent_rules = [WorkerGitRule, WorkerCommandTypeRule]
    rules = [WorkerTaskStartRule, WorkerStopRule]
    opening_lines = ["You are a worker: you do your one task in your worktree and deliver it with journal worker deliver; the journal handles git."]
