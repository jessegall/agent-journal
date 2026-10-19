from journal.features.sharing.sent_comments import SentComments
from journal.features.sharing.share_targets import ShareTargets
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.support.ref import Ref
from journal.models.share import Share
from journal.support.refused import Refused
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope

NAME_LIMIT = 40
TEXT_LIMIT = 2000
VISITOR = "visitor"


class SharedComments:
    """What visitors write under what a link opens: a card of the journal's in the chat, linked to the row as its comment. It is someone else's words, so it never reaches the agent as the user's."""

    def __init__(self, messages: Messages, links: Links, targets: ShareTargets, scope: Scope, sent: SentComments) -> None:
        self.messages, self.links, self.targets, self.scope, self.sent = messages, links, targets, scope, sent

    def leave(self, share: Share, on: str, name: str, text: str) -> Message:
        if not share.comments:
            raise Refused("this link does not take comments")
        name, text = self.named(name), self.worded(text)
        with self.scope.of(share.environment_id):
            row = next((ref for ref in self.targets.shown(share) if str(ref) == on), None)
            if row is None:
                raise Refused("that is not part of this link")
            if self.sent.locked(share.token):
                raise Refused("too many comments on this link just now; try again in a few minutes")
            self.sent.count(share.token)
            return self.written(share, row, name, text)

    def written(self, share: Share, row: Ref, name: str, text: str) -> Message:
        message = self.messages.save(Message(author=Author.SYSTEM, text=f"{name} commented on {row} through a shared link",
                                             data={"kind": "card", "icon": "chat", "tone": "", "detail": text, "row": str(row), VISITOR: name, "share": share.id}), Actor.system())
        self.links.save(Link(source=Ref.to(message), target=row, kind=Messages.COMMENTS_ON), Actor.system())
        return message

    def of(self, share: Share) -> list[Message]:
        with self.scope.of(share.environment_id):
            return self.messages.from_visitors(share.id)

    @staticmethod
    def named(given: str) -> str:
        name = " ".join("".join(ch for ch in str(given) if ch.isprintable() and ch != ":").split())
        if not name or len(name) > NAME_LIMIT:
            raise Refused(f"a name is 1 to {NAME_LIMIT} characters")
        return name

    @staticmethod
    def worded(given: str) -> str:
        text = str(given).strip()
        if not text or len(text) > TEXT_LIMIT:
            raise Refused(f"a comment is 1 to {TEXT_LIMIT} characters")
        return text
