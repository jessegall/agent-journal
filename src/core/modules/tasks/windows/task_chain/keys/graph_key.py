from engine.viewer.window_key import WindowKey


class GraphKey(WindowKey):
    """The graph data of the tasks.task-chain window."""

    name = "graph"
    read = "task graph"
    events = ["task.*"]
