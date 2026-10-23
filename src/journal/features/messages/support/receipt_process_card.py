from journal.chat.process_card import ProcessCard
from journal.chat.process_cards import ProcessCards
from journal.features.messages.support.mentions import Mentions
from journal.models.message import Message
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.actor import Actor
from journal.support.card_kind import CardKind


class ReceiptProcessCard(ProcessCard):
    """The process card naming every row filed from one of the user's messages that no reply of the agent's to it names; it changes as rows are filed and replies name them, and goes once they all are."""

    name = "receipt"

    def __init__(self, messages: Messages, links: Links, cards: ProcessCards) -> None:
        self.messages, self.links, self.cards = messages, links, cards

    def show(self, message: Message) -> None:
        reply_refs = {ref for reply in self.messages.replies(message) for ref in Mentions.found(reply.text)}
        receipt_refs = self.links.targets_except(message, Messages.SUBJECT_LINK, reply_refs)
        key = f"filed:{message.id}"
        if not receipt_refs:
            for card in self.messages.keyed(key, Actor.system()):
                self.messages.delete(card, Actor.system())
            return
        receipt_text = ", ".join(f"{ref.type.rstrip('s')} {ref.id}" for ref in receipt_refs)
        self.cards.show(self.name, message.environment_id, key, f"Filed {receipt_text} from your message", {"kind": "card", "icon": "inbox", "row": f"messages:{message.id}"}, Actor.system(), CardKind.FILED, False)

    def refresh(self, message: Message) -> dict:
        return {"active": False}
