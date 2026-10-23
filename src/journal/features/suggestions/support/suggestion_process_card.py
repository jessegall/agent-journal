from journal.chat.process_card import ProcessCard
from journal.chat.process_cards import ProcessCards
from journal.features.suggestions.support.suggester import Suggester
from journal.models.message import Message
from journal.models.suggestion import Suggestion
from journal.support.actor import Actor
from journal.support.card_kind import CardKind


class SuggestionProcessCard(ProcessCard):
    """The process card of a suggestion the journal makes, open with its accept button until it is answered and then showing the answer."""

    name = "suggestion"

    def __init__(self, cards: ProcessCards) -> None:
        self.cards = cards

    @staticmethod
    def key(suggestion: Suggestion) -> str:
        return f"suggestion:{suggestion.id}"

    def show(self, suggestion: Suggestion, suggester: Suggester, environment_id: int) -> None:
        data = {"kind": "suggestion", "icon": "bulb", "row": f"suggestions:{suggestion.id}", "accept": suggester.accept_label, "answer": suggestion.answer or "", "description": suggester.detail()}
        self.cards.show(self.name, environment_id, self.key(suggestion), suggestion.title, data, Actor.system(), CardKind.SUGGESTIONS, False)

    def refresh(self, message: Message) -> dict:
        return {"active": False}
