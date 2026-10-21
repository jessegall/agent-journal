from journal.models.message import Message
from journal.models.model import Model
from journal.repositories.checks import Checks
from journal.repositories.docs import Docs
from journal.repositories.dumps import Dumps
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.notices import Notices
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.reports import Reports
from journal.repositories.repository import Repository
from journal.repositories.rules import Rules
from journal.repositories.sequences import Sequences
from journal.repositories.tasks import Tasks
from journal.repositories.templates import Templates
from journal.repositories.triggers import Triggers
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.cards import Cards
from journal.support.chat_mark import ChatMark
from journal.support.refused import Refused
from journal.support.row_card import RowCard
from journal.support.scope import Scope

DOCKED = "docked"


class Docking:
    """The rows pinned above the chat: each is a keyed system message whose data carries docked and the row's card, the made mark where the row has one, else a card written for it; undocking leaves the message with docked false."""

    def __init__(self, tasks: Tasks, plans: Plans, docs: Docs, reports: Reports, facts: Facts, rules: Rules, reminders: Reminders, questions: Questions, sequences: Sequences,
                 templates: Templates, workers: Workers, triggers: Triggers, checks: Checks, dumps: Dumps, notices: Notices, messages: Messages, cards: Cards, scope: Scope) -> None:
        self.messages, self.cards, self.scope = messages, cards, scope
        self.kinds: dict[str, Repository] = {kind.model.noun(): kind for kind in (tasks, plans, docs, reports, facts, rules, reminders, questions, sequences, templates, workers, triggers, checks, dumps, notices)}

    def nouns(self) -> tuple[str, ...]:
        return tuple(self.kinds)

    def dock(self, noun: str, n: int, by: Actor) -> Message:
        return self.dock_row(self.kinds[noun].find(n), by)

    def undock(self, noun: str, n: int, by: Actor) -> Message:
        row = self.kinds[noun].find(n)
        card = self.card_of(row)
        if card is None or not card.data.get(DOCKED):
            raise Refused(f"{row.heading()} is not docked")
        return self.release(card, by)

    def dock_row(self, row: Model, by: Actor) -> Message:
        return self.pin(self.card_of(row) or self.new_card(row, by), row, by)

    def pin(self, message: Message, row: Model, by: Actor) -> Message:
        return self.saved_with(message, {**RowCard.of(row).as_data(), DOCKED: True}, by)

    def release(self, message: Message, by: Actor) -> Message:
        return self.saved_with(message, {DOCKED: False}, by)

    def saved_with(self, message: Message, data: dict, by: Actor) -> Message:
        return self.messages.save(message.with_(data={**message.data, **data}), by)

    def card_of(self, row: Model) -> Message | None:
        cards = self.messages.with_key(self.cards.made_key(row))
        return cards[0] if cards else None

    def new_card(self, row: Model, by: Actor) -> Message:
        return self.cards.keyed(self.scope.id, self.cards.made_key(row), row.heading(), {"kind": DOCKED, **RowCard.of(row).as_data()}, by, ChatMark.MADE)
