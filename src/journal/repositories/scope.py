from contextlib import contextmanager
from contextvars import ContextVar
from functools import cache
from typing import Callable, Iterator

from journal.repositories.environments import Environments
from journal.repositories.unscoped import Unscoped

_current: ContextVar[Callable[[], int]] = ContextVar("environment")


class Scope:
    """The environment every scoped read and write of this thread of work is in: set where a request, a hook or a command enters, cleared when it leaves."""

    def __init__(self, environments: Environments) -> None:
        self.environments = environments

    @property
    def id(self) -> int:
        environment = _current.get(None)
        if environment is None:
            raise Unscoped()
        return environment()

    @contextmanager
    def of(self, environment_id: int) -> Iterator[None]:
        with self._holding(lambda: environment_id):
            yield

    @contextmanager
    def requested(self, name: Callable[[], str]) -> Iterator[None]:
        """The environment a request names, looked up the first time a read needs it: a request that reads nothing scoped is never refused for naming none, and a read never makes one."""
        with self._holding(cache(lambda: self.environments.existing(name()).id)):
            yield

    @staticmethod
    @contextmanager
    def _holding(environment: Callable[[], int]) -> Iterator[None]:
        token = _current.set(environment)
        try:
            yield
        finally:
            _current.reset(token)
