from engine.viewer.window_key import WindowKey


class TriggersKey(WindowKey):
    """The triggers data of the triggers.triggers window."""

    name = "triggers"
    read = "trigger list"
    events = ["trigger.*"]
