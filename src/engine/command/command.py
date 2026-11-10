from collections.abc import Sequence
from dataclasses import dataclass, fields
from typing import ClassVar, Generic, TypeIs, TypeVar, get_args
from engine.model.model import Model
from engine.command.command_error import CommandError


R = TypeVar("R", covariant=True)
@dataclass(frozen=True)
class Command(Generic[R]):
    """A request to change something, holding only the data the request needs."""

    lock: ClassVar[bool] = True

    @classmethod
    def label(cls) -> str:
        return cls.__name__

    @classmethod
    def result_type(cls) -> object:
        return next(get_args(base)[0] for base in getattr(cls, "__orig_bases__", ()) if get_args(base))

    @classmethod
    def model(cls) -> type[Model]:
        model_type = cls.result_type()
        if isinstance(model_type, type) and issubclass(model_type, Model):
            return model_type
        raise CommandError(f"{cls.__name__} names no model as its result: {model_type}")

    def is_result(self, value: object) -> TypeIs[R]:
        expected = self.result_type()
        return value is None or not isinstance(expected, type) or isinstance(value, expected)

    def field_values(self, exclusions: Sequence[str]) -> dict[str, object]:
        return {field.name: getattr(self, field.name) for field in fields(self) if field.name not in exclusions}


def is_command_class(class_type: type) -> TypeIs[type[Command[object]]]:
    return issubclass(class_type, Command)
