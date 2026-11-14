from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class InspectionKey(WindowKey):
    """The inspection data of the library.teams window."""

    name = "inspection"
    read = "library inspect {share} {id}"
    loading = KeyLoading.REQUESTED
