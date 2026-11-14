from engine.viewer.window_key import WindowKey


class WaitsKey(WindowKey):
    """What each worker waits on."""

    name = "waits"
    read = "worker waits"
    events = ["agent.*", "task.*", "proof.*", "worker_worktree.*"]
