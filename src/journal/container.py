from typing import Callable, TypeVar

T = TypeVar("T")


class Container:
    """Builds an object from the types its __init__ asks for; one instance per type."""

    def __init__(self) -> None: ...

    def bind(self, kind: type[T], factory: Callable[[], T]) -> None: ...

    def instance(self, kind: type[T], obj: T) -> None: ...

    def get(self, kind: type[T]) -> T: ...

    def call(self, fn: Callable[..., T]) -> T: ...
