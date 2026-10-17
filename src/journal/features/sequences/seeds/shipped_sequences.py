from dataclasses import replace

from journal.features.seed import Seed
from journal.features.sequences.shipped import SHIPPED, UPDATE_WORDS, WRITING_AN_UPDATE
from journal.models.actor import Actor
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
            standing = present.get(sequence.title)
            if standing is None:
                self.sequences.save(sequence, Actor.system())
            elif standing.updated_by == Actor.system() and (standing.steps, standing.finishes_in) != (sequence.steps, sequence.finishes_in):
                self.sequences.save(replace(standing, steps=sequence.steps, finishes_in=sequence.finishes_in), Actor.system())
        if not any(t.action == TriggerAction.SEQUENCE and t.text == WRITING_AN_UPDATE.title for t in self.triggers.all()):
            self.triggers.save(Trigger(words=UPDATE_WORDS, action=TriggerAction.SEQUENCE, text=WRITING_AN_UPDATE.title), Actor.system())
