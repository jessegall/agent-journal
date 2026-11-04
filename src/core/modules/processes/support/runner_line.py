import shlex
from pathlib import Path

from core.modules.processes.support.foreground_run import ForegroundRun
from core.base.caller.caller_request import SESSION_VARIABLE
from core.base.cli.shell_handoff import RUNNER_VARIABLE

MOST_OUTPUT_VARIABLE = "JOURNAL_RUN_MOST_OUTPUT"
READ_FLAGS_VARIABLE = "JOURNAL_RUN_READING"


class RunnerLine:
    """The command the agent's tool runs in place of its own line: the runner, told its process,
    its limit and whether it goes to the background, and the line itself quoted for the shell;
    the agent's session goes along in the variable the journal reads, so a journal command in
    the line runs as that agent. The output settings go in variables, which a runner of an older install ignores."""

    @staticmethod
    def build(runner: Path, process_id: int, run: ForegroundRun, line: str, session: str) -> str:
        background = " --background" if run.background else ""
        background += f" --aliases {shlex.quote(','.join(run.aliases))}" if run.aliases else ""
        background += " --queue" if run.queued else ""
        background += f" --count {shlex.quote(run.count_line)}" if run.count_line else ""
        background += " --only-reads" if run.read_command else ""
        variables = f" {MOST_OUTPUT_VARIABLE}={run.most_output_bytes}" if run.most_output_bytes else ""
        variables += f" {READ_FLAGS_VARIABLE}={shlex.quote(','.join(run.read_flags))}" if run.read_flags else ""
        return f"{SESSION_VARIABLE}={shlex.quote(session)} {RUNNER_VARIABLE}={process_id}{variables} {shlex.quote(str(runner))} --process {process_id} --limit {run.seconds}{background} -- {shlex.quote(line)}"
