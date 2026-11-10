import subprocess

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.run_count_lines import RunCountLines
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine
from core.modules.processes.support.queued_process_start import QueuedProcessStart
from core.modules.processes.errors.missing_runner_error import MissingRunnerError


class QueuedProcessLaunch:
    """Starts the journal runner as a separate process waiting for its assigned queue slot, with the listing that
    counts its tests when it has one."""

    def __init__(self, runner: RunnerBinary, count_lines: RunCountLines) -> None:
        self.runner, self.count_lines = runner, count_lines

    def start(self, start: QueuedProcessStart, run: ForegroundRun) -> None:
        if not self.runner.is_installed():
            raise MissingRunnerError.missing(self.runner.path)
        command = RunnerLine.build(self.runner.path, start.process.id, self.count_lines.counted(run, start.process), start.line, start.session)
        subprocess.Popen(command, shell=True, cwd=start.process.folder, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL, start_new_session=True)
