from typing import Generic, TypeVar

from journal.http.controllers.controller import Controller
from journal.models.scoped import Scoped
from journal.repositories.environments import Environments
from journal.repositories.scoped_repository import ScopedRepository

S = TypeVar("S", bound=Scoped)


class ResourceController(Controller[S], Generic[S]):
    """Index, show, store and update for one scoped model, with nothing of its own."""

    def __init__(self, repository: ScopedRepository[S], environments: Environments) -> None:
        self.repository, self.environments = repository, environments
