from engine.driver.states.agent_row_state import AgentRowState
from suites.coding.modules.workers.rules.phase_test_rule import PhaseTestRule
from suites.coding.modules.workers.rules.worker_log_due_rule import WorkerLogDueRule
from suites.coding.modules.workers.rules.worker_outside_link_rule import WorkerOutsideLinkRule
from suites.coding.modules.workers.rules.worker_read_rule import WorkerReadRule
from suites.coding.modules.workers.rules.worker_report_rule import WorkerReportRule
from suites.coding.modules.workers.rules.worker_stop_rule import WorkerStopRule
from suites.coding.modules.workers.rules.worker_test_count_rule import WorkerTestCountRule
from suites.coding.modules.workers.rules.worker_test_line_rule import WorkerTestLineRule


class WorkerLogDue(AgentRowState):
    """A worker's default state: it stands on the worker's own row and gates the rules only a worker hears, which
    keep their own role filter; a worker whose default was removed hears none of them. The protected folder rule
    stays outside it, so removing the default never lifts a protection."""

    name = "workers.worker-log-due"
    rules = [WorkerLogDueRule, WorkerStopRule, WorkerTestLineRule, PhaseTestRule, WorkerReadRule, WorkerTestCountRule, WorkerReportRule, WorkerOutsideLinkRule]
