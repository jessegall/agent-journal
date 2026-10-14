from journal.models.doc import Doc
from journal.repositories.scoped_repository import ScopedRepository


class Docs(ScopedRepository[Doc]):
    model = Doc
