from journal.models.doc import Doc
from journal.repositories.repository import Repository


class Docs(Repository[Doc]):
    model = Doc

    def titled(self, title: str) -> bool:
        return bool(self.where(title=title))
