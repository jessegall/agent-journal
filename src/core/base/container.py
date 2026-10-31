from inspect import Parameter, signature
from typing import TypeVar, get_type_hints

T = TypeVar("T")



class MissingHintError(Exception):
    """Raised when a class asks for something in its constructor without saying its type."""

    def __init__(self, kind: type, parameter: str) -> None:
        super().__init__(f"{kind.__name__}.__init__ gives no type for {parameter}, so the container cannot build it")


class WrongInstanceError(Exception):
    """Raised when the value stored for a class is not an instance of that class."""

    def __init__(self, kind: type, instance: object) -> None:
        super().__init__(f"the value bound for {kind.__name__} is a {type(instance).__name__}")


class Container:
    """Creates the objects the journal needs and hands each one out, creating it only once."""

    def __init__(self) -> None:
        self.instances: dict[type, object] = {Container: self}

    def bind(self, kind: type[T], instance: T) -> None:
        self.instances[kind] = instance

    def get(self, kind: type[T]) -> T:
        instance = self.instances.get(kind)
        if instance is None:
            built = self.constructed(kind)
            self.instances[kind] = built
            return built
        if isinstance(instance, kind):
            return instance
        raise WrongInstanceError(kind, instance)

    def constructed(self, kind: type[T]) -> T:
        hints = get_type_hints(kind.__init__) if kind.__init__ is not object.__init__ else {}
        needed = [parameter.name for parameter in signature(kind.__init__).parameters.values()
                  if parameter.name != "self" and parameter.default is Parameter.empty and parameter.kind not in (Parameter.VAR_POSITIONAL, Parameter.VAR_KEYWORD)]
        for name in needed:
            if name not in hints:
                raise MissingHintError(kind, name)
        return kind(**{name: self.get(hints[name]) for name in needed})
