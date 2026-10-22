import io
import subprocess
from dataclasses import dataclass
from typing import IO

from journal.features.shell.support.shell_request import ShellRequest


@dataclass(frozen=True)
class ShellProcess:
    """The one shell a chain's parts run in, with the pipe its parts are written to and the pipe its output is read from."""

    process: subprocess.Popen
    stdin: IO[bytes]
    stdout: io.BufferedReader

    @classmethod
    def started(cls, request: ShellRequest) -> "ShellProcess":
        process = subprocess.Popen([request.shell], cwd=request.cwd, env=request.environment, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=False)
        if process.stdin is None or not isinstance(process.stdout, io.BufferedReader):
            raise OSError(f"{request.shell} started without its pipes")
        return cls(process, process.stdin, process.stdout)
