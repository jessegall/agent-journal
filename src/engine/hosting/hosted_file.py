import tomllib
from collections.abc import Mapping
from dataclasses import fields
from functools import cache
from pathlib import Path
from typing import Any

from engine.file.file_access import FileAccess
from engine.hosting.hosted_file_refusal import HostedFileRefusal
from engine.hosting.hosted_mode import HostedMode
from engine.hosting.hosting import Hosting
from engine.journal.journal_home import JournalHome

HOSTED_FILE_PATH = Path("/etc/journal/hosted.toml")


class HostedFile:
    """Reads the hosted file: no file is a local journal, a malformed file or a missing key is refused by name."""

    def __init__(self, path: Path = HOSTED_FILE_PATH) -> None:
        self.path = path

    @staticmethod
    @cache
    def shared_hosting(home: JournalHome) -> Hosting:
        return HostedFile().hosting()

    def hosting(self) -> Hosting:
        if not self.path.is_file():
            return Hosting.local()
        return Hosting.hosted(self.mode(self.table()))

    def table(self) -> dict[str, Any]:
        try:
            return tomllib.loads(FileAccess.shared().read(self.path))
        except tomllib.TOMLDecodeError as error:
            raise HostedFileRefusal.malformed(self.path, error) from error

    def mode(self, table: Mapping[str, Any]) -> HostedMode:
        return HostedMode(**{choice.name: self.value(table, choice.name, choice.type) for choice in fields(HostedMode)})

    def value(self, table: Mapping[str, Any], key: str, expected: Any) -> Any:
        if key not in table:
            raise HostedFileRefusal.missing_key(self.path, key)
        if type(table[key]) is not expected:
            raise HostedFileRefusal.wrong_type(self.path, key, expected)
        return table[key]
