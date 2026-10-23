from datetime import datetime

from journal.models.doc import Doc
from journal.repositories.repository import Repository


class Docs(Repository[Doc]):
    model = Doc

    def recent_docs(self, start: datetime, end: datetime) -> list[Doc]:
        return self.selected(self.query().filter_greater_equal("created_at", start).filter_less("created_at", end).order("id"))

    def titled(self, title: str) -> bool:
        return bool(self.matching(title=title))
