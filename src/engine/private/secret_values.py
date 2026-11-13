from engine.file.file_access import FileAccess
import json
from functools import lru_cache
from engine.file.versions.file_version import FileVersion
from pathlib import Path

from engine.private.private_folder import PrivateFolder

VALUES_SUFFIX = ".env"
SHOWN_SUFFIX = ".shown"
RETIRED_PREFIX = "RETIRED_"
RETIRED_TIME_MARK = "_AT_"
HEADER = "# The values of this project's secrets, written by agent-journal.\n# One line per field: NAME=\"value\". The journal never copies this file anywhere.\n"


class SecretValues:
    """The project's secret values, in the file of version 4's shape in the private folder, readable by its
    user alone and written whole: one line a field, a replaced value kept under a retired name so it is still
    masked, and the shown fields, such as a username, named in a file beside it."""

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder

    def values(self) -> dict[str, str]:
        path = self.folder.file(VALUES_SUFFIX)
        if path is None or not path.is_file():
            return {}
        return dict(self.loaded_values(path, FileAccess.shared().version(path)))

    @staticmethod
    @lru_cache(maxsize=128)
    def loaded_values(path: Path, version: FileVersion) -> tuple[tuple[str, str], ...]:
        return tuple(pair for pair in map(SecretValues.parsed, FileAccess.shared().read(path).splitlines()) if pair is not None)

    def hidden_values(self) -> dict[str, str]:
        shown = self.shown()
        return {value: self.field_variable(name) for name, value in self.values().items() if value and name not in shown}

    def put(self, variable: str, value: str, hidden: bool, epoch_seconds: int) -> None:
        current = self.values()
        previous = current.get(variable)
        retired = {f"{RETIRED_PREFIX}{variable}{RETIRED_TIME_MARK}{epoch_seconds}": previous} if hidden and previous and previous != value else {}
        self.write({**current, **retired, variable: value})
        self.write_shown(self.shown() - {variable} if hidden else self.shown() | {variable})

    def retire(self, variable: str, epoch_seconds: int) -> None:
        current = self.values()
        if variable not in current:
            return
        value = current.pop(variable)
        retired = {f"{RETIRED_PREFIX}{variable}{RETIRED_TIME_MARK}{epoch_seconds}": value} if value and variable not in self.shown() else {}
        self.write({**current, **retired})
        self.write_shown(self.shown() - {variable})

    # Drops each variable's value and every replaced copy of it, so no trace of the value stays in the file.
    def erase(self, variables: tuple[str, ...]) -> None:
        erased = {name for name in self.values() if self.field_variable(name) in variables}
        if not erased:
            return
        self.write({name: value for name, value in self.values().items() if name not in erased})
        self.write_shown(self.shown() - erased)

    @staticmethod
    def field_variable(name: str) -> str:
        return name.removeprefix(RETIRED_PREFIX).rsplit(RETIRED_TIME_MARK, 1)[0] if name.startswith(RETIRED_PREFIX) else name

    def shown(self) -> set[str]:
        path = self.folder.file(SHOWN_SUFFIX)
        if path is None or not path.is_file():
            return set()
        return set(self.loaded_shown(path, FileAccess.shared().version(path)))

    @staticmethod
    @lru_cache(maxsize=128)
    def loaded_shown(path: Path, version: FileVersion) -> frozenset[str]:
        return frozenset(FileAccess.shared().read(path).split())

    def write(self, values: dict[str, str]) -> None:
        self.write_file(self.folder.made_file(VALUES_SUFFIX), HEADER + "".join(f"{name}={json.dumps(value)}\n" for name, value in values.items()))

    def write_shown(self, names: set[str]) -> None:
        self.write_file(self.folder.made_file(SHOWN_SUFFIX), "".join(f"{name}\n" for name in sorted(names)))

    @staticmethod
    def write_file(path: Path, text: str) -> None:
        writing = path.with_name(f"{path.name}.writing")
        with FileAccess.shared().private_writer(writing) as output:
            output.write(text)
        FileAccess.shared().replace(writing, path)

    @staticmethod
    def parsed(line: str) -> tuple[str, str] | None:
        name, equals, remainder = line.strip().partition("=")
        if not equals or name.startswith("#"):
            return None
        return name.strip(), str(json.loads(remainder)) if remainder.startswith('"') else remainder
