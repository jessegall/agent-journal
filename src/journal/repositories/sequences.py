from journal.models.sequence import Sequence
from journal.repositories.repository import Repository


class Sequences(Repository[Sequence]):
    model = Sequence

    def triggered_sequences(self, moment: str) -> list[Sequence]:
        return self.all_matching(trigger_event=moment)

    def titled(self, title: str) -> list[Sequence]:
        return self.all_matching(title=title)
