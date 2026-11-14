from engine.viewer.window_key import WindowKey


class SplitKey(WindowKey):
    """The split data of the workers.workers window."""

    name = "split"
    read = "worker split"
    tab = "split"
    events = ["setting.*", "provider_outage.*", "agent.*", "worker_route.*"]
    reload_seconds = 60
