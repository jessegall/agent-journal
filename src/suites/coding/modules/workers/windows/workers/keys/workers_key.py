from engine.viewer.window_key import WindowKey


class WorkersKey(WindowKey):
    """The workers data of the workers.workers window."""

    name = "workers"
    read = "agent list --role worker"
    tab = "workers"
    events = ["agent.*"]
