from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ItemKey(WindowKey):
    """The item data of the library.teams window."""

    name = "item"
    read = "library show {share} {id}"
    loading = KeyLoading.REQUESTED
