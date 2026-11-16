from core.modules.tasks.support.task_wait_attempts import TaskWaitAttempts
from engine.check.periodic_checks import PeriodicChecks
from engine.check.step_checks import StepChecks
from suites.coding.modules.checks.support.check_task_wait_attempts import CheckTaskWaitAttempts
from suites.coding.modules.checks.support.due_check_runs import DueCheckRuns
from suites.coding.modules.checks.support.passed_checks import PassedChecks

CHECKS_BINDINGS = {PeriodicChecks: DueCheckRuns, StepChecks: PassedChecks, TaskWaitAttempts: CheckTaskWaitAttempts}
