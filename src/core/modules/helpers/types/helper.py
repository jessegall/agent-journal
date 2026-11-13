from engine.enums.access import Access
from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type import HelperType
from core.modules.helpers.support.helper_settings import HELPER_KEPT_LIMIT, HELPER_PROFILE_LIMITS, HELPER_RUN_LIMIT


class Helper(HelperType):
    """A read-only helper the main agent starts to read and report. A designer, a researcher and a reviewer are
    helpers with a profile, and the worker and the merger extend this class."""

    key = "helper"
    label = "Read-only helper"
    access = Access.READ
    run_limit_key = HELPER_RUN_LIMIT
    kept_limit_key = HELPER_KEPT_LIMIT
    profile_limits_key = HELPER_PROFILE_LIMITS
    job_command = ("helper", "send")
    line = "Reads the project and reports; it changes no code."
    behaviours = HelperBehaviours(takes_jobs=False, unblocked_by_started_task=False, takes_tasks=False, takes_prompts=False, takes_marks=True,
                                  runs_plugins=False, dispatches=False, stops_are_checked=False, has_private_outputs=False, needs_readers=False,
                                  queues_runs=False, watches_runs_automatically=False, keeps_runs_after_end=False, reads_project_skills=False,
                                  keeps_pause_after_end=False, has_restricted_aliases=False, runs_saved_commands=True)
