from dataclasses import replace

from journal.features.seed import Seed
from journal.features.sequences.shipped import RETIRED, SHIPPED, SEQUENCE_PHRASES
from journal.support.actor import Actor
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.sequences import Sequences
from journal.repositories.triggers import Triggers
from journal.sync.team_account import TeamAccount


class BuiltinSequences(Seed):
    """The shipped sequences, written by title and kept up to date while only the journal has changed them, and the trigger whose words start the update sequence; in a team only by the machine that holds the team's upgrade, so no two machines write the same one."""

    def __init__(self, sequences: Sequences, triggers: Triggers, account: TeamAccount) -> None:
        self.sequences, self.triggers, self.account = sequences, triggers, account

    def run(self) -> None:
        if not self.account.is_seed_writer():
            return
        present = {sequence.title: sequence for sequence in self.sequences.all()}
        for sequence in SHIPPED:
            data = present.get(sequence.title)
            if data is None:
                self.sequences.save(sequence, Actor.system())
            elif data.updater == Actor.system() and (data.steps, data.end_condition) != (sequence.steps, sequence.end_condition):
                self.sequences.save(replace(data, steps=sequence.steps, end_condition=sequence.end_condition), Actor.system())
        for title in RETIRED:
            data = present.get(title)
            if data is not None and data.updater == Actor.system():
                self.sequences.delete(data, Actor.system())
        for title, phrases in SEQUENCE_PHRASES.items():
            if title not in present and not self.triggers.starting(title):
                self.triggers.save(Trigger(phrases=phrases, action=TriggerAction.SEQUENCE, text=title), Actor.system())
