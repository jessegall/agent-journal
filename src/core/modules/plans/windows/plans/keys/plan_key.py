from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class PlanKey(WindowKey):
    """The plan.* data of the plans.plans window."""

    name = "plan.*"
    read = "plan show {id}"
    loading = KeyLoading.REQUESTED
