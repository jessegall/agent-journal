from engine.viewer.window_key import WindowKey


class TerminalOutputKey(WindowKey):
    """The output of one run, by its id, before or after a line."""

    name = "terminal-output.*"
    read = "output hook-page {id}"
    arguments = ["before", "after"]
