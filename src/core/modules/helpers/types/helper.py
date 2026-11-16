from engine.enums.access import Access
from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type import HelperType
from core.modules.helpers.types.helper_commands import HelperCommands
from core.modules.helpers.support.helper_settings import HELPER_PROFILE_LIMITS, HELPER_RUN_LIMIT


class Helper(HelperType):
    """A read-only helper the main agent starts to read and report. A designer, a researcher and a reviewer
    are helpers with a profile, and a suite's own helper types extend this class."""

    key = "helper"
    label = "Read-only helper"
    access = Access.READ
    run_limit_key = HELPER_RUN_LIMIT
    profile_limits_key = HELPER_PROFILE_LIMITS
    job_command = ("helper", "send")
    line = "Reads the project and reports; it changes no code."
    behaviours = HelperBehaviours(takes_jobs=False, started_task_clears_block=False, takes_tasks=False, takes_prompts=False, takes_marks=True,
                                  runs_plugins=False, dispatches=False, checked_stops=False, has_private_outputs=False, requires_readers=False,
                                  queues_runs=False, watches_runs_automatically=False, continues_runs=False, reads_project_skills=False,
                                  retains_pause=False, has_restricted_aliases=False, runs_saved_commands=True)
    commands = HelperCommands()
