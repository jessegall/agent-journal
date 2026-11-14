from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ProgramsKey(WindowKey):
    """The programs data of the viewer.shell window."""

    name = "programs"
    read = "agent programs"
    loading = KeyLoading.REQUESTED
