import json
import os
import time
import uuid
from functools import cached_property
from pathlib import Path

from journal.config import Config
from journal.support.private_folder import PrivateFolder

RETIRED = "RETIRED_"
AT = "_AT_"
HEADER = """# The values of this project's secrets, written by agent-journal.
# One line per field: NAME="value". The journal never copies this file anywhere.
"""


class SecretValues:
    """The project's secret values, one file in the private folder named by the project's id, readable by its user alone and written whole, so a crash never leaves half a file."""

    def __init__(self, config: Config) -> None:
        self.config = config

    @cached_property
    def path(self) -> Path:
        return PrivateFolder(self.config.root).secrets() / f"{self.project_id()}.env"

    def project_id(self) -> str:
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
        current = self.values()
        retired = {f"{RETIRED}{variable}{AT}{int(time.time())}": current[variable]} if current.get(variable) and current[variable] != value else {}
        self.write({**current, **retired, variable: value})

    def retired_before(self, at: float) -> list[str]:
        return [name for name in self.values() if name.startswith(RETIRED) and int(name.rsplit(AT, 1)[1]) < at]

    def drop(self, variables: list[str]) -> None:
        self.write({name: value for name, value in self.values().items() if name not in variables})

    def write(self, values: dict[str, str]) -> None:
        path = self.path
        PrivateFolder.made(path.parent)
        writing = path.with_suffix(".writing")
        handle = os.open(writing, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(handle, "w") as out:
            out.write(HEADER + "".join(f"{name}={json.dumps(value)}\n" for name, value in values.items()))
        os.replace(writing, path)

    @staticmethod
    def parsed(line: str) -> tuple[str, str] | None:
        name, equals, rest = line.strip().partition("=")
        if not equals or name.startswith("#"):
            return None
        return name.strip(), json.loads(rest) if rest.startswith('"') else rest
