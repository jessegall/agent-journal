from contextlib import contextmanager
from contextvars import ContextVar
from functools import cache
from typing import Callable, Iterator

from journal.repositories.environments import Environments
from journal.support.scope_missing import ScopeMissing

PROJECT = 0
_current: ContextVar[Callable[[], int]] = ContextVar("environment")


class Scope:
    """The environment every scoped read and write of this thread of work is in: set where a request, a hook or a command enters, cleared when it leaves."""

    def __init__(self, environments: Environments) -> None:
        self.environments = environments

    @property
    def id(self) -> int:
        environment = _current.get(None)
        if environment is None:
            raise ScopeMissing()
        return environment()

    def id_default(self, foreign: int) -> int:
        environment = _current.get(None)
        return foreign if environment is None else environment()

    @contextmanager
    def environment(self, environment_id: int) -> Iterator[None]:
        with self._binding(lambda: environment_id):
            yield

    @contextmanager
    def requested(self, name: Callable[[], str]) -> Iterator[None]:
        with self._binding(cache(lambda: self.environments.existing(name()).row_id)):
            yield

    @staticmethod
    @contextmanager
    def _binding(environment: Callable[[], int]) -> Iterator[None]:
        token = _current.set(environment)
        try:
            yield
        finally:
            _current.reset(token)
