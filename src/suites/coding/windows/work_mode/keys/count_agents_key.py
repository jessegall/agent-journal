from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class CountAgentsKey(WindowKey):
    """The kept agents of a type and profile, counted when asked."""

    name = "count-agents"
    read = "agent cards --show all --reusable"
    arguments = ["role", "profile", "page"]
    loading = KeyLoading.REQUESTED
    events = ["agent.*"]
