from engine.enums.access import Access
from core.modules.helpers.types.helper import Helper
from engine.helper_type.helper_behaviours import HelperBehaviours
from suites.coding.modules.workers.bindings.worker_roster import WorkerRoster
from suites.coding.modules.workers.support.worker_settings import WORKER_KEPT_LIMIT, WORKER_RUN_LIMIT
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT


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
    queue_limit_key = WORKER_TEST_LIMIT
    job_command = ("worker", "send")
    job_task_flag = "--task"
    line = "Writes the code of a task in a worktree of its own."
    behaviours = HelperBehaviours(takes_jobs=True, unblocked_by_started_task=True, takes_tasks=True, takes_prompts=True, takes_marks=True,
                                  runs_plugins=True, dispatches=True, stops_are_checked=True, has_private_outputs=True, needs_readers=True,
                                  queues_runs=True, watches_runs_automatically=True, keeps_runs_after_end=True, reads_project_skills=True,
                                  keeps_pause_after_end=True, has_restricted_aliases=True, runs_saved_commands=False)
