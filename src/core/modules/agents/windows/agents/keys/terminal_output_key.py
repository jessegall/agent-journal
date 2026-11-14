from engine.viewer.window_key import WindowKey


class TerminalOutputKey(WindowKey):
    """The terminal-output.* data of the agents.agents window."""

    name = "terminal-output.*"
    read = "output hook-page {id}"
    arguments = ["before", "after"]
