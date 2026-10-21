from journal.features.sharing.support.comment_rate import CommentRate
from journal.features.sharing.share_targets import ShareTargets
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.models.share import Share
from journal.support.rejection import Rejection
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope

NAME_CHARACTERS = 40
TEXT_CHARACTERS = 2000
VISITOR = "visitor"


class SharedComments:
    """What visitors write under what a link opens: a card of the journal's in the chat, linked to the row as its comment. It is someone else's words, so it never reaches the agent as the user's."""

    def __init__(self, messages: Messages, links: Links, targets: ShareTargets, scope: Scope, transmitted: CommentRate) -> None:
        self.messages, self.links, self.targets, self.scope, self.sent = messages, links, targets, scope, transmitted

    def leave(self, share: Share, enabled: str, name: str, text: str) -> Message:
        if not share.comments:
            raise Rejection("this link does not take comments")
        name, text = self.lookup(name), self.text(text)
        with self.scope.environment(share.environment_id):
            row = next((ref for ref in self.targets.shown(share) if str(ref) == enabled), None)
            if row is None:
                raise Rejection("that is not part of this link")
            if self.sent.locked(share.token):
                raise Rejection("too many comments on this link just now; try again in a few minutes")
            self.sent.count(share.token)
            return self.stored(share, row, name, text)

    def stored(self, share: Share, row: Ref, name: str, text: str) -> Message:
        message = self.messages.save(Message(author=Author.SYSTEM, text=f"{name} commented on {row} through a shared link",
                                             data={"kind": "card", "icon": "chat", "tone": "", "detail": text, "row": str(row), VISITOR: name, "share": share.id}), Actor.system())
        self.links.save(Link(source=Ref.build(message), target=row, kind=Messages.COMMENT_LINK), Actor.system())
        return message

    def comments(self, share: Share) -> list[Message]:
        with self.scope.environment(share.environment_id):
            return self.messages.visitor_messages(share.row_id)

    @staticmethod
    def lookup(value: str) -> str:
        name = " ".join("".join(ch for ch in str(value) if ch.isprintable() and ch != ":").split())
        if not name or len(name) > NAME_CHARACTERS:
            raise Rejection(f"a name is 1 to {NAME_CHARACTERS} characters")
        return name

    @staticmethod
    def text(value: str) -> str:
        text = str(value).strip()
        if not text or len(text) > TEXT_CHARACTERS:
            raise Rejection(f"a comment is 1 to {TEXT_CHARACTERS} characters")
        return text
