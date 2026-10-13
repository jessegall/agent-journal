"""Whether the agent of an environment works the list without asking, decided by work tracking with its own rule."""

from framework.loaded import FEATURES

AUTO_MODE = "work_tracking"


def automatic(record) -> bool:
    """Whether the agent of this environment works the list without asking. Asked of the running feature, never worked out again here: work tracking decides it with its own rule, where an environment steered by a row counts as auto."""
    return AUTO_MODE in FEATURES and bool(FEATURES[AUTO_MODE].on(record, "auto"))
