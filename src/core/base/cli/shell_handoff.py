import os
import subprocess
import tempfile
from collections import deque
from typing import TextIO

from core.base.cli.shell_run import ShellRun

RUNNER_VARIABLE = "JOURNAL_RUNNER_PROCESS"
UNWATCHED_LIMIT_SECONDS = 15
UNWATCHED_LINES_SHOWN = 40


class ShellHandoff:
    """Runs a shell line in the caller's folder, or the journal's own when the caller named none, with the
    variables set. Under the runner its output goes where the journal's own goes, line by line as it comes.
    With no runner around it, as when a hook could not reach the server, the output goes to a file: the last
    lines are printed, and a run past the limit goes on by itself and says where its output is."""

    def run(self, shell_run: ShellRun, stream: TextIO) -> int:
        return self.streamed(shell_run, stream) if RUNNER_VARIABLE in shell_run.variables else self.unwatched(shell_run, stream)

    def streamed(self, shell_run: ShellRun, stream: TextIO) -> int:
        with subprocess.Popen(["sh", "-c", shell_run.line], cwd=shell_run.folder if shell_run.folder else None, env={**os.environ, **shell_run.variables},
                              stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as process:
            for line in process.stdout or ():
                stream.write(line)
                stream.flush()
            return process.wait()

    def unwatched(self, shell_run: ShellRun, stream: TextIO) -> int:
        with tempfile.NamedTemporaryFile("w", prefix="journal-run-", suffix=".txt", delete=False) as output:
            process = subprocess.Popen(["sh", "-c", shell_run.line], cwd=shell_run.folder if shell_run.folder else None, env={**os.environ, **shell_run.variables},
                                       stdin=subprocess.DEVNULL, stdout=output, stderr=subprocess.STDOUT, start_new_session=True)
        try:
            code = process.wait(timeout=UNWATCHED_LIMIT_SECONDS)
        except subprocess.TimeoutExpired:
            stream.write(f"moved to the background with no journal watching it: its output goes to {output.name}\n")
            return 0
        with open(output.name, encoding="utf-8", errors="replace") as output_lines:
            for line in deque(output_lines, UNWATCHED_LINES_SHOWN):
                stream.write(line)
        os.unlink(output.name)
        return code
