from dataclasses import replace
from journal.support.cards import Cards
from journal.support.run_tracker import RunTracker
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.sequences import Sequences
from journal.support.card_kind import CardKind


class TriggerFire:
    """What matched triggers record, wherever the words came up: a card for each, and a sequence started at its first step, whose line comes back; what is said of the rest is the triggers conduct's."""

    def __init__(self, cards: Cards, runs: RunTracker, sequences: Sequences) -> None:
        self.cards, self.runs, self.sequences = cards, runs, sequences

    def fired(self, matched: list[Trigger], session: str, environment_id: int, by_user: bool) -> None:
        for trigger in matched:
            self.cards.show(environment_id, session, f"Trigger {trigger.text}", "bolt", "", ", ".join(trigger.text), f"triggers:{trigger.id}", shows=CardKind.TRIGGERS)
            if trigger.action == TriggerAction.SEQUENCE and by_user:
                self.started(trigger, session, environment_id)

    def started(self, trigger: Trigger, session: str, environment_id: int) -> None:
        for sequence in self.sequences.all():
            if sequence.title == trigger.text and self.runs.start(sequence, session, environment_id):
                self.runs.changed(session, environment_id, lambda run: replace(run, said_at=""))
