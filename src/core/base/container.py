import sys
from inspect import Parameter, signature
from typing import TypeVar, get_type_hints

from core.base.missing_hint_error import MissingHintError
from core.base.unbound_value_error import UnboundValueError
from core.base.wrong_instance_error import WrongInstanceError

T = TypeVar("T")


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
        if class_type.__module__.partition(".")[0] in sys.stdlib_module_names | {"builtins"}:
            raise UnboundValueError(class_type)
        hints = get_type_hints(class_type.__init__) if class_type.__init__ is not object.__init__ else {}
        needed = [parameter.name for parameter in signature(class_type.__init__).parameters.values()
                  if parameter.name != "self" and parameter.default is Parameter.empty and parameter.kind not in (Parameter.VAR_POSITIONAL, Parameter.VAR_KEYWORD)]
        for name in needed:
            if name not in hints:
                raise MissingHintError(class_type, name)
        return class_type(**{name: self.get(hints[name]) for name in needed})
