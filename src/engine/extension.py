from dataclasses import dataclass
from pathlib import Path

from engine.record import Record
from engine.runtime import env

EXTENSIONS: list["Extension"] = []


@dataclass(frozen=True)
class Entry:
    owner: object
    key: object
    value: object


def record_of(source) -> Record:
    return Record(source, env(source)) if isinstance(source, Path) else getattr(source, "record", source)


class Extension:
    def __init__(self):
        self.entries: list[Entry] = []
        EXTENSIONS.append(self)

    def add(self, owner, value, key=None, first: bool = False) -> None:
        entry = Entry(owner, key, value)
        if first:
            self.entries.insert(0, entry)
        else:
            self.entries.append(entry)

    def remove(self, value) -> None:
        self.entries = [entry for entry in self.entries if entry.value is not value]

    def each(self, source=None, key=None) -> list:
        return [entry.value for entry in self._live(source) if key is None or entry.key == key]

    def keyed(self, source=None) -> dict:
        return {entry.key: entry.value for entry in self._live(source)}

    def _live(self, source) -> list[Entry]:
        record = record_of(source) if source is not None else None
        return [entry for entry in self.entries if record is None or entry.owner is None or entry.owner.enabled(record)]

    def clear(self) -> None:
        self.entries.clear()


def clear_all() -> None:
    for extension in EXTENSIONS:
        extension.clear()
