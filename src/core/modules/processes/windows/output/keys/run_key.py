from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class RunKey(WindowKey):
    """The run.* data of the processes.output window."""

    name = "run.*"
    read = "process feed --id {id}"
    loading = KeyLoading.REQUESTED
