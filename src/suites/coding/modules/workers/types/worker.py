from engine.enums.access import Access
from core.modules.helpers.types.helper import Helper
from suites.coding.modules.workers.bindings.worker_roster import WorkerRoster
from suites.coding.modules.workers.support.worker_settings import WORKER_KEPT_LIMIT, WORKER_RUN_LIMIT


class Worker(Helper):
    """A coding worker: it writes its task in its own worktree and hands in proofs."""

    key = "worker"
    label = "Worker"
    access = Access.WRITING
    separate_folder = True
    default_profile = "journal-worker-medior"
    start_line = "journal worker dispatch"
    roster = WorkerRoster
    run_limit_key = WORKER_RUN_LIMIT
    kept_limit_key = WORKER_KEPT_LIMIT
    profile_limits_key = ""
    job_command = ("worker", "send")
    job_task_flag = "--task"
    line = "Writes the code of a task in a worktree of its own."
