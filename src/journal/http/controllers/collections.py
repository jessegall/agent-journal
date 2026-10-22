from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.models.collection import Collection
from journal.repositories.collections import Collections


class CollectionController(Controller[Collection]):
    """The collections here, each with the rows it holds; the viewer makes one, renames it, or says what belongs in it."""

    repository: Collections

    def __init__(self, collections: Collections) -> None:
        self.repository = collections

    def rows(self) -> list[Collection]:
        return self.repository.scoped()

    def shown_page(self, rows: list[Collection]) -> list[dict]:
        return [{**ModelFields.build(c), "members": [str(ref) for ref in self.repository.members(c)]} for c in rows]
