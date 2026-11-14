from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class SummaryKey(WindowKey):
    """The summary.* data of the processes.output window."""

    name = "summary.*"
    read = "output peek {id} --summary"
    loading = KeyLoading.REQUESTED
