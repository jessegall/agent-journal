from collections.abc import Callable, Generator
from contextlib import contextmanager
from typing import TypeVar, cast

T = TypeVar("T")


class RequestValues:
    """Keeps values while one request is answered, so its rules share one read of something costly. A value is read
    again when its version changes, and outside a request every read loads it."""

    def __init__(self) -> None:
        self.is_open = False
        self.values: dict[str, tuple[object, object]] = {}

    @contextmanager
    def opened(self) -> Generator[None]:
        if self.is_open:
            yield
            return
        self.is_open = True
        try:
            yield
        finally:
            self.is_open = False
            self.values.clear()

    # a value another reader of this request already has, kept as if it had been read
    def keep(self, key: str, version_reader: Callable[[], object], value: object) -> None:
        if self.is_open:
            self.values[key] = (version_reader(), value)

    def read(self, key: str, version_reader: Callable[[], object], loader: Callable[[], T]) -> T:
        if not self.is_open:
            return loader()
        version = version_reader()
        kept = self.values.get(key)
        if kept is not None and kept[0] == version:
            return cast(T, kept[1])
        loaded = loader()
        self.values[key] = (version, loaded)
        return loaded
