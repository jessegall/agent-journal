from engine.enums.access import Access
from core.modules.helpers.types.helper import Helper
from engine.helper_type.helper_behaviours import HelperBehaviours
from suites.coding.modules.workers.bindings.worker_roster import WorkerRoster
from suites.coding.modules.workers.support.worker_operation_line import WORKER_OPERATION_RUN
from suites.coding.modules.workers.types.worker_commands import WorkerCommands
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.support.coding_settings import COMMAND_TYPES, WORKER_KEPT_LIMIT, WORKER_RUN_LIMIT, WORKER_TEST_LIMIT


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
    line = "Writes the code of a task in a separate worktree."
    behaviours = HelperBehaviours(takes_jobs=True, started_task_clears_block=True, takes_tasks=True, takes_prompts=True, takes_marks=True,
                                  runs_plugins=True, dispatches=True, checked_stops=True, has_private_outputs=True, needs_readers=True,
                                  queues_runs=True, watches_runs_automatically=True, continues_runs=True, reads_project_skills=True,
                                  retains_pause=True, has_restricted_aliases=True, runs_saved_commands=False)
    commands = WorkerCommands()
    journal_runs = tuple([WORKER_OPERATION_RUN])
    command_types_setting = COMMAND_TYPES
    refusal_hint = AskTopic.TOOL.question_line()
