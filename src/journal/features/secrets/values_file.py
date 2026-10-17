import json
import os
import uuid
from pathlib import Path

from journal.config import Config
from journal.private_folder import PrivateFolder

HEADER = """# The values of this project's secrets, written by agent-journal.
# One line per field: NAME="value". The journal never copies this file anywhere.
"""


class ValuesFile:
    """The project's secret values, one file in the private folder named by the project's id, readable by its user alone and written whole, so a crash never leaves half a file."""

    def __init__(self, config: Config) -> None:
        self.config = config

    @property
    def path(self) -> Path:
        return PrivateFolder(self.config.root).secrets() / f"{self.project_id()}.env"

    def project_id(self) -> str:
        """The project's id, made the first time it is needed and kept in the project's journal folder, so a folder moved on disk keeps its values."""
        path = self.config.home / "project-id"
        if not path.is_file():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(uuid.uuid4().hex)
        return path.read_text().strip()

    def values(self) -> dict[str, str]:
        path = self.path
        if not path.is_file():
            return {}
        return dict(found for found in map(self.parsed, path.read_text().splitlines()) if found)

    def put(self, variable: str, value: str) -> None:
        self.write({**self.values(), variable: value})

    def drop(self, variables: list[str]) -> None:
        self.write({name: value for name, value in self.values().items() if name not in variables})

    def write(self, values: dict[str, str]) -> None:
        path = self.path
        writing = path.with_suffix(".writing")
        handle = os.open(writing, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(handle, "w") as out:
            out.write(HEADER + "".join(f"{name}={json.dumps(value)}\n" for name, value in values.items()))
        os.replace(writing, path)

    @staticmethod
    def parsed(line: str) -> tuple[str, str] | None:
        """A NAME="value" line as its name and value; a comment or a blank line is none."""
        name, equals, rest = line.strip().partition("=")
        if not equals or name.startswith("#"):
            return None
        return name.strip(), json.loads(rest) if rest.startswith('"') else rest
