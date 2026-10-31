import shlex

from core.modules.processes.support.foreground_limit import ForegroundRun

RUNNER = "journal-run"


class RunnerLine:
    """The command the agent's tool runs in place of its own line: the runner, told its process, its limit and
    whether it goes to the background, and the line itself quoted for the shell."""

    @staticmethod
    def of(process_id: int, run: ForegroundRun, line: str) -> str:
        background = " --background" if run.background else ""
        return f"{RUNNER} --process {process_id} --limit {run.seconds}{background} -- {shlex.quote(line)}"
