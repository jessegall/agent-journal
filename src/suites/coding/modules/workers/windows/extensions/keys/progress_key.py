from engine.viewer.window_key import WindowKey


class ProgressKey(WindowKey):
    """How far each worker has got with its tasks."""

    name = "progress"
    read = "worker progress"
    events = ["task.*", "worker_worktree.*"]
