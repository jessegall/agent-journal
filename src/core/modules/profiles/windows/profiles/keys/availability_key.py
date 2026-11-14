from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class AvailabilityKey(WindowKey):
    """The availability data of the profiles.profiles window."""

    name = "availability"
    read = "helper availability"
    arguments = ["profile", "program"]
    loading = KeyLoading.REQUESTED
