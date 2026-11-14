from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class PlacesKey(WindowKey):
    """The places data of the tasks.tasks window."""

    name = "places"
    read = "plan places"
    loading = KeyLoading.REQUESTED
