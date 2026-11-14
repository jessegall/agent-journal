from engine.viewer.window_key import WindowKey


class ToolsKey(WindowKey):
    """The tools data of the tools.tools window."""

    name = "tools"
    read = "tool list"
    events = ["tool.*"]
