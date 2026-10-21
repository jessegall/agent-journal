import inspect
from typing import Callable, TypeVar, get_type_hints

T = TypeVar("T")


class Container:
    """Builds an object from the types its __init__ asks for; one instance per type."""

    def __init__(self) -> None:
        self._factories: dict[type, Callable[[], object]] = {}
        self._instances: dict[type, object] = {}

    def bind(self, kind: type[T], factory: Callable[[], T]) -> None:
        self._factories[kind] = factory

    def instance(self, kind: type[T], value: T) -> None:
        self._instances[kind] = value

    def get(self, kind: type[T]) -> T:
        if kind not in self._instances:
            self._instances[kind] = self._factories[kind]() if kind in self._factories else self.call(kind)
        return self._instances[kind]

    def call(self, fn: Callable[..., T]) -> T:
        target = fn.__init__ if inspect.isclass(fn) else fn
        hints = get_type_hints(target)
        kwargs = {}
        for name, parameter in inspect.signature(target).parameters.items():
            if name == "self" or name not in hints:
                continue
            kind = hints[name]
            if self.is_buildable(kind, parameter):
                kwargs[name] = self.get(kind)
        return fn(**kwargs)

    def is_buildable(self, kind: object, parameter: inspect.Parameter) -> bool:
        return kind in self._instances or kind in self._factories or inspect.isclass(kind) and parameter.default is inspect.Parameter.empty
