from engine.enums.access import Access
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
