import os
import subprocess

from core.base.journal_home import JournalHome
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine

LIMIT_SECONDS = 0
HOME_VARIABLE = "JOURNAL_HOME"


class WorkerTestLaunch:
    """Starts a worker's test through the journal's runner, in the background and in the worker's worktree, so it is
    a run like any other, with its output and its end reported. The runner is told the journal's folder, since the
    worktree it starts in has none of its own."""

    def __init__(self, runner: RunnerBinary, home: JournalHome) -> None:
        self.runner, self.home = runner, home

    def start(self, process_id: int, line: str, folder: str, session: str) -> None:
        command = RunnerLine.build(self.runner.path, process_id, ForegroundRun(LIMIT_SECONDS, True), line, session)
        environment = {**os.environ, HOME_VARIABLE: str(self.home.folder.resolve())}
        subprocess.Popen(command, shell=True, cwd=folder, env=environment, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
