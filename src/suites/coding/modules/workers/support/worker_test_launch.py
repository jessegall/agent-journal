from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.queued_process_start import QueuedProcessStart

LIMIT_SECONDS = 0


class WorkerTestLaunch:
    """Starts a worker's test through the journal's runner, in the background and in the worker's worktree, so it is
    a run like any other, with its output and its end reported."""

    def __init__(self, launch: QueuedProcessLaunch) -> None:
        self.launch = launch

    def start(self, process: Process, line: str, session: str) -> None:
        self.launch.start(QueuedProcessStart(process, line, session), ForegroundRun(LIMIT_SECONDS, True, queued=True))
