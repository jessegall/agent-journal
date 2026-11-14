from engine.viewer.window_key import WindowKey


class GraphKey(WindowKey):
    """The graph data of the tasks.tasks window."""

    name = "graph"
    read = "task graph"
    tab = "graph"
    events = ["task.*"]
