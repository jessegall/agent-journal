from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class SkillsKey(WindowKey):
    """The skills data of the viewer.shell window."""

    name = "skills"
    read = "agent-skill list"
    arguments = ["agent"]
    loading = KeyLoading.REQUESTED
