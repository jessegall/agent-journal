from dataclasses import dataclass
from importlib import import_module
from importlib.util import find_spec
from pathlib import Path
from typing import TypeVar

T = TypeVar("T")


class DottedPathError(Exception):
    """Raised when a dotted path does not lead to a class."""


class WrongBaseError(Exception):
    """Raised when a registered class does not extend the base its registry list asks for."""


@dataclass(frozen=True)
class DottedPath:
    """The location of a class, written module:Class, so it can be named without being imported."""

    text: str

    @classmethod
    def class_path(cls, class_type: type) -> "DottedPath":
        return cls(f"{class_type.__module__}:{class_type.__qualname__}")

    def loaded(self) -> type:
        target = self.value()
        if not isinstance(target, type):
            raise DottedPathError(f"{self.text} names no class")
        return target

    def checked_class(self, base: type[T]) -> type[T]:
        target = self.loaded()
        if not issubclass(target, base):
            raise WrongBaseError(f"{self.text} is no {base.__name__}")
        return target

    def value(self) -> object:
        module, _, name = self.text.partition(":")
        if not hasattr(import_module(module), name):
            raise DottedPathError(f"{self.text} names nothing in {module}")
        return getattr(import_module(module), name)

    def source_file(self) -> Path:
        spec = find_spec(self.text.partition(":")[0])
        if spec is None or spec.origin is None:
            raise DottedPathError(f"{self.text} names no module file")
        return Path(spec.origin)
