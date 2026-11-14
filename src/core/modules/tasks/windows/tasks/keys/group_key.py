from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class GroupKey(WindowKey):
    """The group data of the tasks.tasks window."""

    name = "group"
    read = "task board"
    arguments = ["state", "limit", "before-id", "before-closed-at", "tag", "hide-plan-tasks"]
    loading = KeyLoading.REQUESTED
