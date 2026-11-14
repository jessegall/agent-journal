from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class SkillsKey(WindowKey):
    """The skills data of the profiles.profiles window."""

    name = "skills"
    read = "profile skills"
    arguments = ["profile"]
    loading = KeyLoading.REQUESTED
