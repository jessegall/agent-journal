import json
import os
from pathlib import Path

from core.modules.secrets.support.private_folder import PrivateFolder

VALUES_SUFFIX = ".env"
SHOWN_SUFFIX = ".shown"
RETIRED_PREFIX = "RETIRED_"
RETIRED_TIME_MARK = "_AT_"
FILE_MODE = 0o600
HEADER = "# The values of this project's secrets, written by agent-journal.\n# One line per field: NAME=\"value\". The journal never copies this file anywhere.\n"


class SecretValues:
    """The project's secret values, in the file of version 4's shape in the private folder, readable by its user
    alone and written whole: one line a field, a replaced value kept under a retired name so it is still
    masked, and the shown fields, such as a username, named in a file beside it."""

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder

    def values(self) -> dict[str, str]:
        path = self.folder.file(VALUES_SUFFIX)
        if path is None or not path.is_file():
            return {}
        return dict(pair for pair in map(self.parsed, path.read_text().splitlines()) if pair is not None)

    def hidden_values(self) -> dict[str, str]:
        shown = self.shown()
        return {value: name.removeprefix(RETIRED_PREFIX).rsplit(RETIRED_TIME_MARK, 1)[0] for name, value in self.values().items() if value and name not in shown}

    def put(self, variable: str, value: str, hidden: bool, epoch_seconds: int) -> None:
        current = self.values()
        previous = current.get(variable)
        retired = {f"{RETIRED_PREFIX}{variable}{RETIRED_TIME_MARK}{epoch_seconds}": previous} if hidden and previous and previous != value else {}
        self.write({**current, **retired, variable: value})
        self.write_shown(self.shown() - {variable} if hidden else self.shown() | {variable})

    def shown(self) -> set[str]:
        path = self.folder.file(SHOWN_SUFFIX)
        return set(path.read_text().split()) if path is not None and path.is_file() else set()

    def write(self, values: dict[str, str]) -> None:
        self.write_file(self.folder.made_file(VALUES_SUFFIX), HEADER + "".join(f"{name}={json.dumps(value)}\n" for name, value in values.items()))

    def write_shown(self, names: set[str]) -> None:
        self.write_file(self.folder.made_file(SHOWN_SUFFIX), "".join(f"{name}\n" for name in sorted(names)))

    @staticmethod
    def write_file(path: Path, text: str) -> None:
        writing = path.with_name(f"{path.name}.writing")
        with os.fdopen(os.open(writing, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, FILE_MODE), "w") as output:
            output.write(text)
        os.replace(writing, path)

    @staticmethod
    def parsed(line: str) -> tuple[str, str] | None:
        name, equals, remainder = line.strip().partition("=")
        if not equals or name.startswith("#"):
            return None
        return name.strip(), str(json.loads(remainder)) if remainder.startswith('"') else remainder
