from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class AssignKey(WindowKey):
    """The board of the assign rules, read when asked."""

    name = "assign"
    read = "assign-rule board"
    loading = KeyLoading.REQUESTED
    events = ["assign_rule.*", "assign_rule_condition.*", "agent.*", "worker_route.*"]
