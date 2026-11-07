import subprocess

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine


class QueuedProcessLaunch:
    """Starts the journal runner as a separate process waiting for its assigned queue slot."""

    def __init__(self, runner: RunnerBinary) -> None:
        self.runner = runner

    def start(self, process_id: int, line: str, folder: str, session: str, run: ForegroundRun) -> None:
        command = RunnerLine.build(self.runner.path, process_id, run, line, session)
        subprocess.Popen(command, shell=True, cwd=folder, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL, start_new_session=True)
