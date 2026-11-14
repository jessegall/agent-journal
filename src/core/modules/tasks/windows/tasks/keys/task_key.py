from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class TaskKey(WindowKey):
    """The task.* data of the tasks.tasks window."""

    name = "task.*"
    read = "task show {id}"
    loading = KeyLoading.REQUESTED
