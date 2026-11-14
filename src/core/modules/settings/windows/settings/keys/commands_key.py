from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class CommandsKey(WindowKey):
    """The commands data of the settings.settings window."""

    name = "commands"
    read = "alias saved --limit 1000"
    events = ["alias.*"]
    loading = KeyLoading.REQUESTED
