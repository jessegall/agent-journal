from engine.viewer.window_key import WindowKey


class LogsKey(WindowKey):
    """The logs data of the developer.system-logs window."""

    name = "logs"
    read = "developer system-logs"
    arguments = ["page", "source", "level", "limit"]
