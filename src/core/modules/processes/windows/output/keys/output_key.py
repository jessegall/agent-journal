from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class OutputKey(WindowKey):
    """The output.* data of the processes.output window."""

    name = "output.*"
    read = "output page {id}"
    arguments = ["after", "before"]
    loading = KeyLoading.REQUESTED
