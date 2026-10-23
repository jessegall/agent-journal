from journal.chat.process_card import ProcessCard
from journal.chat.process_cards import ProcessCards
from journal.models.message import Message
from journal.repositories.scope import Scope
from journal.support.actor import Actor
from journal.support.card_kind import CardKind


class SlowRequestProcessCard(ProcessCard):
    """The process card of one slow route: how many times it went over its budget and its worst time, updated in place at each slow request."""

    name = "slow_request"

    def __init__(self, cards: ProcessCards, scope: Scope) -> None:
        self.cards, self.scope = cards, scope

    @staticmethod
    def key(method: str, route: str) -> str:
        return f"slow:{method} {route}"

    def show(self, method: str, route: str, data: dict, detail: str) -> None:
        self.cards.show(self.name, self.scope.id, self.key(method, route), f"Slow request: {method} {route}", data, Actor.system(), CardKind.FAULTS, False, detail)

    def refresh(self, message: Message) -> dict:
        return {"active": False}
