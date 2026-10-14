from journal.models.sequence import Sequence
from journal.repositories.repository import Repository


class Sequences(Repository[Sequence]):
    model = Sequence
