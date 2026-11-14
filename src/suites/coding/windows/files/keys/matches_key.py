from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class MatchesKey(WindowKey):
    """The files whose names hold the words asked for, read when asked."""

    name = "matches"
    read = "project-file find {words}"
    loading = KeyLoading.REQUESTED
