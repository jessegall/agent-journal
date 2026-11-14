from engine.viewer.window_key import WindowKey


class RoutesKey(WindowKey):
    """The routes data of the workers.workers window."""

    name = "routes"
    read = "worker-route list"
    tab = "split"
    events = ["worker_route.*"]
