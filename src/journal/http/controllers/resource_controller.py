from typing import Generic, TypeVar

from journal.http.controllers.controller import Controller
from journal.models.model import Model
from journal.repositories.repository import Repository

S = TypeVar("S", bound=Model)


class ResourceController(Controller[S], Generic[S]):
    """Index, show, store and update for one model, with nothing of its own."""

    def __init__(self, repository: Repository[S]) -> None:
        self.repository = repository
