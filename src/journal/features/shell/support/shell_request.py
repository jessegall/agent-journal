from dataclasses import dataclass

from journal.support.posted_environment import PostedEnvironment


@dataclass(frozen=True)
class ShellRequest:
    """One line to run, as the shim posted it: the line, the folder it runs in, the shell that runs it and the environment it runs with."""

    line: str
    cwd: str
    shell: str
    environment: dict[str, str]

    @classmethod
    def parse(cls, raw: bytes, cwd: str, shell: str) -> "ShellRequest":
        body = PostedEnvironment.split(raw, "a shell line")
        return cls(line=body.payload.decode(errors="replace"), cwd=cwd, shell=shell or "bash", environment=body.environment)
