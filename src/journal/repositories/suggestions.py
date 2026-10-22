from journal.models.suggestion import Suggestion
from journal.repositories.repository import Repository


class Suggestions(Repository[Suggestion]):
    """What the journal has suggested in this project, the same for every environment."""

    model = Suggestion

    def is_recorded(self, key: str) -> bool:
        return bool(self.matching(key=key))
