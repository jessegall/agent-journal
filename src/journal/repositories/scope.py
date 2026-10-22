from functools import cache
from typing import Callable

from journal.repositories.environments import Environments
from journal.repositories.scope_binding import CURRENT, ScopeBinding
from journal.support.scope_missing import ScopeMissing

PROJECT = 0


class Scope:
    """The environment every scoped read and write of this thread of work is in: set where a request, a hook or a command enters, cleared when it leaves."""

    def __init__(self, environments: Environments) -> None:
        self.environments = environments

    @property
    def id(self) -> int:
        environment = CURRENT.get(None)
        if environment is None:
            raise ScopeMissing()
        return environment()

    def id_default(self, foreign: int) -> int:
        environment = CURRENT.get(None)
        return foreign if environment is None else environment()

    def environment(self, environment_id: int) -> ScopeBinding:
        return ScopeBinding(lambda: environment_id)

    def requested(self, name: Callable[[], str]) -> ScopeBinding:
        return ScopeBinding(cache(lambda: self.environments.existing(name()).row_id))
