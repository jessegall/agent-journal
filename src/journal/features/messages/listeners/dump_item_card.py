from journal.support.cards import Cards
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.support.actor import Actor
from journal.models.link import Link
from journal.models.message import Message
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.card_kind import CardKind


class DumpItemCard(Listener[Created]):
    """A row filed from one of the user's messages is a mark in the chat, one per message, naming every row filed from it so far."""

    def __init__(self, messages: Messages, links: Links, cards: Cards) -> None:
        self.messages, self.links, self.cards = messages, links, cards

    def handle(self, event: Created) -> None:
        link = event.model
        if not isinstance(link, Link) or link.kind != Messages.SUBJECT_LINK or link.source.type != Message.table():
            return
        message = self.messages.find(link.source.id)
        filed = ", ".join(f"{ref.type.rstrip('s')} {ref.id}" for ref in self.links.targets(message, Messages.SUBJECT_LINK))
        key = f"filed:{message.id}"
        self.cards.keyed(message.environment_id, key, f"Filed {filed} from your message", {"kind": "card", "session": "", "icon": "inbox", "row": f"messages:{message.id}"}, Actor.system(), CardKind.FILED)
