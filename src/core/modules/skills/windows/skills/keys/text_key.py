from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class TextKey(WindowKey):
    """The text data of the skills.skills window."""

    name = "text"
    read = "skill show"
    arguments = ["folder"]
    loading = KeyLoading.REQUESTED
