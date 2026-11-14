from engine.viewer.window_extension import WindowExtension


class ShellWorkersExtension(WindowExtension):
    """The worktrees, points and proofs the viewer's shell shows, and the worker lines it runs."""

    window = "viewer.shell"
    reads = ["worker-worktree points", "worker-worktree list", "proof list"]
    runs = ["worker send", "worker merge", "worker release"]
    events = ["proof.*", "worker_worktree.*"]
    key_events = {"usage": ["proof.*", "worker_worktree.*"], "bars": ["proof.*", "worker_worktree.*"]}
