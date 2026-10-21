import json
import os
import time as timing
import uuid
from functools import cached_property
from pathlib import Path

from journal.config import Config
from journal.support.private_folder import PrivateFolder
from journal.support.secret_field import SecretField

RETIRED = "RETIRED_"
EMAIL_SIGN_TOKEN = "_AT_"
HEADER = """# The values of this project's secrets, written by agent-journal.
# One line per field: NAME="value". The journal never copies this file anywhere.
"""


class SecretValues:
    """The project's secret values, one file in the private folder named by the project's id, readable by its user alone and written whole, so a crash never leaves half a file. A field shown while typing is no secret: its value is kept for the programs that need it and named in the shown file beside, so no mask is made of it."""

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
        return dict(rows for rows in map(self.parsed, path.read_text().splitlines()) if rows)

    def put_field(self, field: SecretField, value: str) -> None:
        if field.hidden:
            self.put(field.variable, value)
        else:
            self.put_shown(field.variable, value)

    def put(self, variable: str, value: str) -> None:
        current = self.values()
        retired = {f"{RETIRED}{variable}{EMAIL_SIGN_TOKEN}{int(timing.time())}": current[variable]} if current.get(variable) and current[variable] != value else {}
        self.write({**current, **retired, variable: value})
        self.write_shown(self.shown() - {variable})

    def put_shown(self, variable: str, value: str) -> None:
        self.write({**self.values(), variable: value})
        self.write_shown(self.shown() | {variable})

    @cached_property
    def shown_path(self) -> Path:
        return self.path.with_suffix(".shown")

    def shown(self) -> set[str]:
        return set(self.shown_path.read_text().split()) if self.shown_path.is_file() else set()

    def write_shown(self, names: set[str]) -> None:
        PrivateFolder.made(self.shown_path.parent)
        self.shown_path.write_text("".join(f"{name}\n" for name in sorted(names)))

    def retired_before(self, time: float) -> list[str]:
        return [name for name in self.values() if name.startswith(RETIRED) and int(name.rsplit(EMAIL_SIGN_TOKEN, 1)[1]) < time]

    def drop(self, variables: list[str]) -> None:
        self.write({name: value for name, value in self.values().items() if name not in variables})
        self.write_shown(self.shown() - set(variables))

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
