import shlex

from core.modules.processes.support.foreground_limit import ForegroundRun

SESSION_VARIABLE = "JOURNAL_AGENT_SESSION"


class RunnerLine:
    """The command the agent's tool runs in place of its own line: the runner, told its process,
    its limit and whether it goes to the background, and the line itself quoted for the shell;
    the agent's session goes along in the variable the journal reads, so a journal command in
    the line runs as that agent."""

    @staticmethod
    def build(runner: str, process_id: int, run: ForegroundRun, line: str, session: str) -> str:
        background = " --background" if run.background else ""
        return f"{SESSION_VARIABLE}={shlex.quote(session)} {shlex.quote(runner)} --process {process_id} --limit {run.seconds}{background} -- {shlex.quote(line)}"
