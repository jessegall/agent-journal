from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class FitnessKey(WindowKey):
    """The fitness data of the viewer.shell window."""

    name = "fitness"
    read = "usage fitness"
    arguments = ["agent"]
    loading = KeyLoading.REQUESTED
