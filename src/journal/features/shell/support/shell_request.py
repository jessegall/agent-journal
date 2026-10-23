from dataclasses import dataclass, replace
from pathlib import Path

from journal.support.posted_environment import PostedEnvironment

OUTPUT_FOLDER_VARIABLE = "JOURNAL_OUTPUT_FOLDER"


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

    def folder_request(self, folder: Path) -> "ShellRequest":
        return replace(self, environment={**self.environment, OUTPUT_FOLDER_VARIABLE: str(folder)})
