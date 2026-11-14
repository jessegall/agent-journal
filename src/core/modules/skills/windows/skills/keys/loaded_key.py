from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class LoadedKey(WindowKey):
    """The loaded data of the skills.skills window."""

    name = "loaded"
    read = "agent-skill list --limit 1000"
    arguments = ["agent"]
    events = ["agent_skill.*"]
    loading = KeyLoading.REQUESTED
