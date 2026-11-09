from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.queued_process_start import QueuedProcessStart
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_WAIT

FALLBACK_SECONDS = 5


class WorkerTestLaunch:
    """Starts a worker's test through the journal's runner, in the worker's worktree, so it is a run like
    any other, with its output and its end reported. A test the journal runs goes to the background at
    once; one the worker waits for stays in the foreground until the wait asks it to move, or moves itself
    a few seconds later if the server stopped."""

    def __init__(self, launch: QueuedProcessLaunch, settings: SettingValues) -> None:
        self.launch, self.settings = launch, settings

    def start(self, process: Process, line: str, session: str) -> None:
        self.launch.start(QueuedProcessStart(process, line, session), ForegroundRun.queued_background())

    def start_waited(self, process: Process, line: str, session: str) -> None:
        wait = int(self.settings.number(WORKER_RUN_WAIT))
        run = ForegroundRun(wait + FALLBACK_SECONDS, wait == 0, queued=True, queue_wait_seconds=wait)
        self.launch.start(QueuedProcessStart(process, line, session), run)
