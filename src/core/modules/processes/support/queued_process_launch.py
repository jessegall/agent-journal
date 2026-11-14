import subprocess

from engine.agent.agent_checkouts import AgentCheckouts

from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.run_count_lines import RunCountLines
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine
from core.modules.processes.support.queued_process_start import QueuedProcessStart
from core.modules.processes.errors.missing_runner_error import MissingRunnerError


class QueuedProcessLaunch:
    """Starts the journal runner as a separate process waiting for its assigned queue slot, with the listing that
    counts its tests when it has one."""

    def __init__(self, runner: RunnerBinary, count_lines: RunCountLines, checkouts: AgentCheckouts) -> None:
        self.runner, self.count_lines, self.checkouts = runner, count_lines, checkouts

    # the runner's pid, which lives while the run waits for its slot and while it runs
    def start(self, start: QueuedProcessStart, run: ForegroundRun) -> int:
        if not self.runner.is_installed():
            raise MissingRunnerError.missing(self.runner.path)
        command = RunnerLine.build(self.runner.path, start.process.id, self.count_lines.counted(run, start.process), start.line, start.session, self.checkouts.checkout(start.process.session_agent_id))
        return subprocess.Popen(command, shell=True, cwd=start.process.folder, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                stderr=subprocess.DEVNULL, start_new_session=True).pid
