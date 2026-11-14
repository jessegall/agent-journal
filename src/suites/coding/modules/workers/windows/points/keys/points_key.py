from engine.viewer.window_key import WindowKey


class PointsKey(WindowKey):
    """The points data of the workers.points window."""

    name = "points"
    read = "worker-worktree points"
    arguments = ["agent"]
    events = ["proof.*", "worker_worktree.*"]
