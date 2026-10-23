from journal.chat.process_card import ProcessCard
from journal.chat.process_cards import DOCKED, ProcessCards
from journal.models.message import Message
from journal.models.model import Model
from journal.models.support.row_card import RowCard
from journal.support.actor import Actor
from journal.support.card_kind import CardKind


class RowProcessCard(ProcessCard):
    """The process card of a row in the chat, the made card of a document or report or the card a row is docked by, which docking pins above the chat and releases."""

    name = "row"

    def __init__(self, cards: ProcessCards) -> None:
        self.cards = cards

    @staticmethod
    def key(row: Model) -> str:
        return f"made:{row.noun()}:{row.id}"

    def show(self, environment_id: int, row: Model, actor: Actor) -> Message:
        data = {"kind": "made", "made_type": row.table(), "n": row.id, **RowCard.build(row).as_data()}
        return self.cards.show(self.name, environment_id, self.key(row), row.title_words(), data, actor, CardKind.CREATED, False, session=actor.id)

    def show_docked(self, environment_id: int, row: Model, actor: Actor) -> Message:
        return self.cards.show(self.name, environment_id, self.key(row), row.heading(), {"kind": DOCKED, **RowCard.build(row).as_data()}, actor, CardKind.CREATED, False)

    def refresh(self, message: Message) -> dict:
        return {"active": False}
