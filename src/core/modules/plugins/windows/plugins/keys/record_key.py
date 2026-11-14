from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class RecordKey(WindowKey):
    """The record.* data of the plugins.plugins window."""

    name = "record.*"
    read = "plugin record {id}"
    name_ids = True
    loading = KeyLoading.REQUESTED
