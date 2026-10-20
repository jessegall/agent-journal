from journal.support.cards import Cards
from journal.support.running import Running
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.sequences import Sequences
from journal.support.chat_mark import ChatMark


class Firing:
    """What met triggers record, wherever the words came up: a card for each, and a sequence started at its first step, whose line comes back; what is said of the rest is the triggers conduct's."""

    def __init__(self, cards: Cards, running: Running, sequences: Sequences) -> None:
        self.cards, self.running, self.sequences = cards, running, sequences

    def lines(self, met: list[Trigger], session: str, environment_id: int, by_user: bool) -> list[str]:
        lines = []
        for trigger in met:
            self.cards.show(environment_id, session, f"Trigger {trigger.text}", "bolt", "", ", ".join(trigger.words), f"triggers:{trigger.id}", shows=ChatMark.TRIGGERS)
            if trigger.action == TriggerAction.SEQUENCE and by_user:
                lines.append(self.started(trigger, session, environment_id))
        return [line for line in lines if line]

    def started(self, trigger: Trigger, session: str, environment_id: int) -> str:
        for sequence in self.sequences.all():
            if sequence.title == trigger.text:
                return self.running.start(sequence, session, environment_id)
        return ""
