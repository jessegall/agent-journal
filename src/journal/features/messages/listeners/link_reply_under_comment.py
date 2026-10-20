from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.models.link import Link
from journal.models.message import Message
from journal.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.not_found import NotFound


class LinkReplyUnderComment(Listener[Created]):
    """A reply to a comment on a row is a comment on that row too, so the thread under the row shows the answer beneath what it answers; a reply to that reply is talk in the chat, not a comment."""

    def __init__(self, messages: Messages, links: Links) -> None:
        self.messages, self.links = messages, links

    def handle(self, event: Created) -> None:
        reply = event.model
        if not isinstance(reply, Message) or not reply.reply_to:
            return
        try:
            answered = self.messages.find(reply.reply_to)
        except NotFound:
            return
        if answered.reply_to:
            return
        already = self.links.targets(reply, Messages.COMMENTS_ON)
        for row in self.links.targets(answered, Messages.COMMENTS_ON):
            if row not in already:
                self.links.save(Link(source=Ref.to(reply), target=row, kind=Messages.COMMENTS_ON), event.by)
