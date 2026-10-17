from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages


class Cards:
    """A mark in the chat for a moment worth seeing: a check that ran, a trigger that fired, a question answered, a skill loaded, a halt. One funnel writes them, as messages of the system's; the viewer draws each as a card by its kind."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def show(self, environment_id: int, session: str, label: str, icon: str, tone: str = "", detail: str = "", row: str = "", kind: str = "card", by: Actor = Actor.system()) -> Message:
        """The card, written by whoever's act it marks: the system's own notices, or the user's act shown on the user's side."""
        data = {"kind": kind, "session": session, "icon": icon, "tone": tone, "detail": detail, "row": row}
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, text=label, data=data), by)

    def keyed(self, environment_id: int, key: str, label: str, data: dict, by: Actor) -> Message:
        """A card that stands for one thing, such as a file's findings: it replaces the earlier card of its key by the same writer. With no key it is a card like any other."""
        for earlier in self.messages.keyed(key, by) if key else ():
            self.messages.delete(earlier, by)
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, text=label, data={"session": "", "row": "", **data, "key": key}), by)
