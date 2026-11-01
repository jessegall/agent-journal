import os
import subprocess
from typing import TextIO

from core.base.cli.shell_run import ShellRun


class ShellHandoff:
    """Runs a shell line in the caller's folder, or the journal's own when the caller named none, with the
    variables set, and writes its output where the journal's own output goes, line by line as it comes."""

    def run(self, shell_run: ShellRun, stream: TextIO) -> int:
        with subprocess.Popen(["sh", "-c", shell_run.line], cwd=shell_run.folder if shell_run.folder else None, env={**os.environ, **shell_run.variables},
                              stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as process:
            for line in process.stdout or ():
                stream.write(line)
                stream.flush()
            return process.wait()
