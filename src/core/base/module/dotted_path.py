from dataclasses import dataclass
from importlib import import_module


class DottedPathFault(Exception):
    """Raised when a dotted path does not lead to a class."""


@dataclass(frozen=True)
class DottedPath:
    """Where a class lives, written module:Class, so it can be named without being imported."""

    text: str

    @classmethod
    def class_path(cls, kind: type) -> "DottedPath":
        return cls(f"{kind.__module__}:{kind.__qualname__}")

    def loaded(self) -> type:
        module, _, name = self.text.partition(":")
        target = getattr(import_module(module), name, None)
        if not isinstance(target, type):
            raise DottedPathFault(f"{self.text} names no class")
        return target
