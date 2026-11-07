import subprocess

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine
from core.modules.processes.support.queued_process_start import QueuedProcessStart
from core.modules.processes.support.missing_runner_error import MissingRunnerError


class QueuedProcessLaunch:
    """Starts the journal runner as a separate process waiting for its assigned queue slot."""

    def __init__(self, runner: RunnerBinary) -> None:
        self.runner = runner

    def start(self, start: QueuedProcessStart, run: ForegroundRun) -> None:
        if not self.runner.is_installed():
            raise MissingRunnerError.missing(self.runner.path)
        command = RunnerLine.build(self.runner.path, start.process_id, run, start.line, start.session)
        subprocess.Popen(command, shell=True, cwd=start.folder, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL, start_new_session=True)
