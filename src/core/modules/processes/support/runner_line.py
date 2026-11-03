import shlex
from pathlib import Path

from core.modules.processes.support.foreground_run import ForegroundRun
from core.base.caller.caller_request import SESSION_VARIABLE


class RunnerLine:
    """The command the agent's tool runs in place of its own line: the runner, told its process,
    its limit and whether it goes to the background, and the line itself quoted for the shell;
    the agent's session goes along in the variable the journal reads, so a journal command in
    the line runs as that agent."""

    @staticmethod
    def build(runner: Path, process_id: int, run: ForegroundRun, line: str, session: str) -> str:
        background = " --background" if run.background else ""
        background += f" --aliases {shlex.quote(','.join(run.aliases))}" if run.aliases else ""
        background += " --queue" if run.queued else ""
        background += " --only-reads" if run.read_command else ""
        return f"{SESSION_VARIABLE}={shlex.quote(session)} {shlex.quote(str(runner))} --process {process_id} --limit {run.seconds}{background} -- {shlex.quote(line)}"
