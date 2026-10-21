from dataclasses import replace

from journal.features.seed import Seed
from journal.features.sequences.shipped import RETIRED, SHIPPED, WORDS
from journal.support.actor import Actor
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.sequences import Sequences
from journal.repositories.triggers import Triggers


class ShippedSequences(Seed):
    """The shipped sequences, written by title and kept up to date while only the journal has changed them, and the trigger whose words start the update sequence."""

    def __init__(self, sequences: Sequences, triggers: Triggers) -> None:
        self.sequences, self.triggers = sequences, triggers

    def run(self) -> None:
        present = {sequence.title: sequence for sequence in self.sequences.all()}
        for sequence in SHIPPED:
            snapshot = present.get(sequence.title)
            if snapshot is None:
                self.sequences.save(sequence, Actor.system())
            elif snapshot.updated_by == Actor.system() and (snapshot.steps, snapshot.finishes_in) != (sequence.steps, sequence.finishes_in):
                self.sequences.save(replace(snapshot, steps=sequence.steps, finishes_in=sequence.finishes_in), Actor.system())
        for title in RETIRED:
            snapshot = present.get(title)
            if snapshot is not None and snapshot.updated_by == Actor.system():
                self.sequences.delete(snapshot, Actor.system())
        for title, words in WORDS.items():
            if title not in present and not self.triggers.starting(title):
                self.triggers.save(Trigger(words=words, action=TriggerAction.SEQUENCE, text=title), Actor.system())
