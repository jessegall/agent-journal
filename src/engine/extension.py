from dataclasses import dataclass

from engine.record import Record

EXTENSIONS: list["Extension"] = []


@dataclass(frozen=True)
class Entry:
    owner: object
    key: object
    value: object


class Extension:
    def __init__(self):
        self.entries: list[Entry] = []
        self.version = 0
        EXTENSIONS.append(self)

    def add(self, owner, value, key=None) -> None:
        self.entries.append(Entry(owner, key, value))
        self.version += 1

    def remove(self, value) -> None:
        self.entries = [entry for entry in self.entries if entry.value is not value]
        self.version += 1

    def each(self, record: Record | None = None, key=None) -> list:
        return [entry.value for entry in self._live(record) if key is None or entry.key == key]

    def keyed(self, record: Record | None = None) -> dict:
        return {entry.key: entry.value for entry in self._live(record)}

    def _live(self, record: Record | None) -> list[Entry]:
        return [entry for entry in self.entries if record is None or entry.owner is None or entry.owner.enabled(record)]

    def clear(self) -> None:
        self.entries.clear()
        self.version += 1


def clear_all() -> None:
    for extension in EXTENSIONS:
        extension.clear()
