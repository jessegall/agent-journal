from journal.features.seed import Seed
from journal.features.sequences.shipped import SHIPPED, UPDATE_WORDS, WRITING_AN_UPDATE
from journal.models.actor import Actor
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.sequences import Sequences
from journal.repositories.triggers import Triggers


class ShippedSequences(Seed):
    """The shipped sequences, written once by title, and the trigger whose words start the update sequence."""

    def __init__(self, sequences: Sequences, triggers: Triggers) -> None:
        self.sequences, self.triggers = sequences, triggers

    def run(self) -> None:
        present = {sequence.title for sequence in self.sequences.all()}
        for sequence in SHIPPED:
            if sequence.title not in present:
                self.sequences.save(sequence, Actor.system())
        if not any(t.action == TriggerAction.SEQUENCE and t.text == WRITING_AN_UPDATE.title for t in self.triggers.all()):
            self.triggers.save(Trigger(words=UPDATE_WORDS, action=TriggerAction.SEQUENCE, text=WRITING_AN_UPDATE.title), Actor.system())
