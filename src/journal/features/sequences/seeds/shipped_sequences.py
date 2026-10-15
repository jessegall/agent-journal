from journal.features.seed import Seed
from journal.features.sequences.shipped import SHIPPED
from journal.models.actor import Actor
from journal.repositories.sequences import Sequences


class ShippedSequences(Seed):
    """The shipped sequences, written once by title."""

    def __init__(self, sequences: Sequences) -> None:
        self.sequences = sequences

    def run(self) -> None:
        present = {sequence.title for sequence in self.sequences.all()}
        for sequence in SHIPPED:
            if sequence.title not in present:
                self.sequences.save(sequence, Actor.system())
