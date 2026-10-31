from inspect import Parameter, signature
from typing import TypeVar, get_type_hints

T = TypeVar("T")



class MissingHintError(Exception):
    """Raised when a class asks for something in its constructor without saying its type."""

    def __init__(self, class_type: type, parameter: str) -> None:
        super().__init__(f"{class_type.__name__}.__init__ gives no type for {parameter}, so the container cannot build it")


class WrongInstanceError(Exception):
    """Raised when the value stored for a class is not an instance of that class."""

    def __init__(self, class_type: type, instance: object) -> None:
        super().__init__(f"the value bound for {class_type.__name__} is a {type(instance).__name__}")


class Container:
    """Creates the objects the journal needs and hands each one out, creating it only once; a module may name
    the class that stands in for an interface of the core."""

    def __init__(self) -> None:
        self.instances: dict[type, object] = {Container: self}
        self.substitutes: dict[type, type[object]] = {}

    def bind(self, class_type: type[T], instance: T) -> None:
        self.instances[class_type] = instance

    def substitute(self, class_type: type, implementation: type) -> None:
        if not issubclass(implementation, class_type):
            raise WrongInstanceError(class_type, implementation)
        self.substitutes[class_type] = implementation

    def get(self, class_type: type[T]) -> T:
        instance: object = self.instances.get(class_type)
        if instance is None:
            implementation: type[object] = self.substitutes.get(class_type, class_type)
            instance = self.constructed(implementation)
            self.instances[class_type] = instance
        if isinstance(instance, class_type):
            return instance
        raise WrongInstanceError(class_type, instance)

    def constructed(self, class_type: type[T]) -> T:
        hints = get_type_hints(class_type.__init__) if class_type.__init__ is not object.__init__ else {}
        needed = [parameter.name for parameter in signature(class_type.__init__).parameters.values()
                  if parameter.name != "self" and parameter.default is Parameter.empty and parameter.kind not in (Parameter.VAR_POSITIONAL, Parameter.VAR_KEYWORD)]
        for name in needed:
            if name not in hints:
                raise MissingHintError(class_type, name)
        return class_type(**{name: self.get(hints[name]) for name in needed})
