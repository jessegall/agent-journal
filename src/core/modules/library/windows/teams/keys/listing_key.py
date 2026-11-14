from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ListingKey(WindowKey):
    """The listing data of the library.teams window."""

    name = "listing"
    read = "library browse"
    arguments = ["type", "search"]
    loading = KeyLoading.REQUESTED
