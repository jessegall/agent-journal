from journal.chat.cards import Cards
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.features.messages.support.mentions import Mentions
from journal.models.author import Author
from journal.support.actor import Actor
from journal.models.link import Link
from journal.models.message import Message
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.card_kind import CardKind
from journal.support.missing_row import MissingRow


class DumpItemCard(Listener[Created]):
    """A row filed from one of the user's messages is a mark in the chat, one per message, naming every row filed from it that no reply of the agent's to the message names; once the replies name them all, the mark goes."""

    def __init__(self, messages: Messages, links: Links, cards: Cards) -> None:
        self.messages, self.links, self.cards = messages, links, cards

    def handle(self, event: Created) -> None:
        for message in self.subjects(event.model):
            self.refresh(message)

    def subjects(self, row) -> list[Message]:
        if isinstance(row, Link) and row.kind == Messages.SUBJECT_LINK and row.source.type == Message.table():
            return [self.messages.find(row.source.id)]
        if isinstance(row, Message) and row.author == Author.AGENT and row.reply_target:
            return self.requested(row.reply_target)
        return []

    def requested(self, n: int) -> list[Message]:
        try:
            return [self.messages.find(n)]
        except MissingRow:
            return []

    def refresh(self, message: Message) -> None:
        reply_refs = {ref for reply in self.messages.replies(message) for ref in Mentions.found(reply.text)}
        receipt_refs = self.links.targets_except(message, Messages.SUBJECT_LINK, reply_refs)
        key = f"filed:{message.id}"
        if not receipt_refs:
            for card in self.messages.keyed(key, Actor.system()):
                self.messages.delete(card, Actor.system())
            return
        receipt_text = ", ".join(f"{ref.type.rstrip('s')} {ref.id}" for ref in receipt_refs)
        self.cards.keyed(message.environment_id, key, f"Filed {receipt_text} from your message", {"kind": "card", "icon": "inbox", "row": f"messages:{message.id}"}, Actor.system(), CardKind.FILED)
