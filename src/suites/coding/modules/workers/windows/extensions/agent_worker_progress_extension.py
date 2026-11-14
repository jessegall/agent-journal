from engine.viewer.window_extension import WindowExtension
from engine.viewer.window_source import WindowSource
from suites.coding.modules.workers.windows.extensions.keys.progress_key import ProgressKey
from suites.coding.modules.workers.windows.extensions.keys.waits_key import WaitsKey


class AgentWorkerProgressExtension(WindowExtension):
    """The proofs, waits and progress an agent list shows for each worker; the agents and the helpers list each
    extend their window with it."""

    reads = ["proof list", "worker waits", "worker progress"]
    runs = ["worker send"]
    events = ["proof.*", "worker_worktree.*"]
    key_events = {"agents": ["proof.*", "worker_worktree.*"], "limits": ["worker_worktree.*"]}
    keys = [WaitsKey, ProgressKey]
    sources = [WindowSource("waits", "worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]),
               WindowSource("progress", "worker progress", ["task.*", "worker_worktree.*"]),
               WindowSource("queue", "proof list --limit 50", ["proof.*"])]
