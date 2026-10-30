from collections.abc import Callable
from inspect import Parameter, signature
from typing import TypeVar, get_origin, get_type_hints

T = TypeVar("T")


class MissingHint(Exception):
    """A constructor parameter the container cannot build, because it names no type."""

    def __init__(self, kind: type, parameter: str) -> None:
        super().__init__(f"{kind.__name__}.__init__ gives no type for {parameter}, so the container cannot build it")


class Container:
    """Builds each class once from its constructor's type hints and keeps it; a parameter with a default is left
    to it; a family of classes, such as every Query[M], is built by the provider registered for it."""

    def __init__(self) -> None:
        self.instances: dict[object, object] = {Container: self}
        self.providers: dict[type, Callable[["Container", object], object]] = {}

    def bind(self, kind: object, instance: object) -> None:
        self.instances[kind] = instance

    def provide(self, family: type, provider: Callable[["Container", object], object]) -> None:
        self.providers[family] = provider

    def get(self, kind: type[T]) -> T:
        if kind not in self.instances:
            self.instances[kind] = self.built(kind)
        return self.instances[kind]

    def built(self, kind: object) -> object:
        origin = get_origin(kind) or kind
        family = next((family for family in getattr(origin, "__mro__", ()) if family in self.providers), None)
        if family is not None:
            return self.providers[family](self, kind)
        return self.constructed(origin)

    def constructed(self, kind: type) -> object:
        hints = get_type_hints(kind.__init__) if kind.__init__ is not object.__init__ else {}
        needed = [parameter.name for parameter in signature(kind.__init__).parameters.values()
                  if parameter.name != "self" and parameter.default is Parameter.empty and parameter.kind not in (Parameter.VAR_POSITIONAL, Parameter.VAR_KEYWORD)]
        for name in needed:
            if name not in hints:
                raise MissingHint(kind, name)
        return kind(**{name: self.get(hints[name]) for name in needed})
