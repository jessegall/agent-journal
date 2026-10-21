from dataclasses import dataclass

from journal.support.rejection import Rejection

ENVIRONMENT_END = b"\0\0"


@dataclass(frozen=True)
class ShellRequest:
    """One line to run, as the shim posted it: the line, the folder it runs in, the shell that runs it and the environment it runs with."""

    line: str
    cwd: str
    shell: str
    environment: dict[str, str]

    @classmethod
    def parse(cls, raw: bytes, cwd: str, shell: str) -> "ShellRequest":
        pairs, separator, line = raw.partition(ENVIRONMENT_END)
        if not separator:
            raise Rejection("a shell line is posted as the environment, a double NUL and the line")
        environment = dict(pair.decode(errors="replace").split("=", 1) for pair in pairs.split(b"\0") if b"=" in pair)
        return cls(line=line.lstrip(b"\0").decode(errors="replace"), cwd=cwd, shell=shell or "bash", environment=environment)
