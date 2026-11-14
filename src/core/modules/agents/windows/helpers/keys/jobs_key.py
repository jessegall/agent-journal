from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class JobsKey(WindowKey):
    """The jobs data of the agents.helpers window."""

    name = "jobs"
    read = "task list --state open --limit 100"
    loading = KeyLoading.REQUESTED
    arguments = ["page"]
