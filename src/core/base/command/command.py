from dataclasses import dataclass, fields
from typing import Generic, TypeVar, get_args

from core.base.model.model import Model

R = TypeVar("R", covariant=True)


class CommandFault(Exception):
    """Raised when a command class does not say which model it works on."""


@dataclass(frozen=True)
class Command(Generic[R]):
    """A request to change something, holding only the data the request needs."""

    @classmethod
    def label(cls) -> str:
        return cls.__name__

    @classmethod
    def result_type(cls) -> object:
        return next(get_args(base)[0] for base in getattr(cls, "__orig_bases__", ()) if get_args(base))

    @classmethod
    def model(cls) -> type[Model]:
        kind = cls.result_type()
        if isinstance(kind, type) and issubclass(kind, Model):
            return kind
        raise CommandFault(f"{cls.__name__} names no model as its result: {kind}")

    def field_values(self, exclusions: tuple[str, ...]) -> dict[str, object]:
        return {field.name: getattr(self, field.name) for field in fields(self) if field.name not in exclusions}
