import os
import shlex
from pathlib import Path

from engine.checkout.checkout import Checkout
from core.modules.processes.support.foreground_run import ForegroundRun
from engine.caller.caller_request import SESSION_VARIABLE
from engine.cli.shell_handoff import RUNNER_VARIABLE

MOST_OUTPUT_VARIABLE = "JOURNAL_RUN_MOST_OUTPUT"
READ_FLAGS_VARIABLE = "JOURNAL_RUN_READING"
QUEUE_WAIT_VARIABLE = "JOURNAL_RUN_QUEUE_WAIT"
COUNTED_QUEUE_VARIABLE = "JOURNAL_RUN_COUNTED_QUEUE"
READ_FOLDERS_VARIABLE = "JOURNAL_RUN_READ_FOLDERS"
PROGRESS_COUNT_VARIABLE = "JOURNAL_RUN_PROGRESS_LISTING"
PROGRESS_POSITION_VARIABLE = "JOURNAL_RUN_PROGRESS_POSITION"
PROGRESS_PATTERN_VARIABLE = "JOURNAL_RUN_PROGRESS_PATTERN"


class RunnerLine:
    """The command the agent's tool runs in place of its own line: the runner, told its process,
    its limit and whether it goes to the background, and the line itself quoted for the shell;
    the agent's session goes along in the variable the journal reads, so a journal command in
    the line runs as that agent, and the roots of its checkout and project go along for every command in it. The output settings go in variables, which a runner of an older install
    ignores."""

    @staticmethod
    def process_id(line: str) -> int | None:
        prefix = f"{RUNNER_VARIABLE}="
        for word in line.split():
            number = word.removeprefix(prefix)
            if number != word and number.isdigit():
                return int(number)
        return None

    @staticmethod
    def build(runner: Path, process_id: int, run: ForegroundRun, line: str, session: str, checkout: Checkout | None = None) -> str:
        background = " --background" if run.background else ""
        background += f" --aliases {shlex.quote(','.join(run.aliases))}" if run.aliases else ""
        background += " --queue" if run.queued else ""
        background += f" --count {shlex.quote(run.count_line)}" if run.count_line else ""
        background += " --only-reads" if run.read_command else ""
        background += " --read-only-shell" if run.shell_sandbox else ""
        background += f" --write-folder {shlex.quote(str(run.folder))}" if run.folder is not None else ""
        variables = f" {MOST_OUTPUT_VARIABLE}={run.most_output_bytes}" if run.most_output_bytes else ""
        variables += f" {READ_FLAGS_VARIABLE}={shlex.quote(','.join(run.read_flags))}" if run.read_flags else ""
        variables += f" {QUEUE_WAIT_VARIABLE}={run.queue_wait_seconds}" if run.queued else ""
        variables += f" {COUNTED_QUEUE_VARIABLE}=1" if run.counted_queue else ""
        variables += f" {READ_FOLDERS_VARIABLE}={shlex.quote(os.pathsep.join(str(folder) for folder in run.read_folders))}" if run.read_folders else ""
        variables += f" {PROGRESS_COUNT_VARIABLE}={shlex.quote(run.progress_count_line)} {PROGRESS_POSITION_VARIABLE}={run.progress_count_position} {PROGRESS_PATTERN_VARIABLE}={shlex.quote(run.progress_count_pattern)}" if run.progress_count_line else ""
        variables += "".join(f" {name}={shlex.quote(value)}" for name, value in checkout.root_variables().items()) if checkout is not None else ""
        session_variable = f"{SESSION_VARIABLE}={shlex.quote(session)} " if session else ""
        return f"{session_variable}{RUNNER_VARIABLE}={process_id}{variables} {shlex.quote(str(runner))} --process {process_id} --limit {run.seconds}{background} -- {shlex.quote(line)}"
