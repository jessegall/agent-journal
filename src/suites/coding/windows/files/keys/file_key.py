from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class FileKey(WindowKey):
    """One file of the project, read when asked."""

    name = "file"
    read = "project-file show {path}"
    loading = KeyLoading.REQUESTED
