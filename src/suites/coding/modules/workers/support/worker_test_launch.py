import subprocess

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine

LIMIT_SECONDS = 0


class WorkerTestLaunch:
    """Starts a worker's test through the journal's runner, in the background and in the worker's worktree, so it is
    a run like any other, with its output and its end reported."""

    def __init__(self, runner: RunnerBinary) -> None:
        self.runner = runner

    def start(self, process_id: int, line: str, folder: str, session: str) -> None:
        command = RunnerLine.build(self.runner.path, process_id, ForegroundRun(LIMIT_SECONDS, True), line, session)
        subprocess.Popen(command, shell=True, cwd=folder, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
