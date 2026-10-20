from journal.support.actor import Actor
from journal.support.chat_mark import ChatMark
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages


class Cards:
    """A mark in the chat for a moment worth seeing: a check that ran, a trigger that fired, a question answered, a skill loaded, a halt. One funnel writes them, as messages of the system's; the viewer draws each as a card by its kind."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def show(self, environment_id: int, session: str, label: str, icon: str, tone: str = "", detail: str = "", row: str = "", kind: str = "card", by: Actor = Actor.system(), key: str = "", command: str = "", *, shows: ChatMark) -> Message:
        """The card, written by whoever's act it marks: the system's own notices, or the user's act shown on the user's side; with a key, a later card of it settles this one in place; a command is drawn on one line, cut short; what it shows names the switch that hides it."""
        return self.keyed(environment_id, key, label, {"kind": kind, "session": session, "icon": icon, "tone": tone, "detail": detail, "row": row, "command": command}, by, shows)

    def keyed(self, environment_id: int, key: str, label: str, data: dict, by: Actor, shows: ChatMark) -> Message:
        """A card that stands for one thing, such as a file's findings: a later card of its key by the same writer settles it in place, where it already stands in the chat. With no key it is a card like any other."""
        data = {"session": "", "row": "", **data, "key": key, "shows": str(shows)}
        earlier = self.messages.keyed(key, by) if key else []
        if earlier:
            return self.messages.save(earlier[0].with_(text=label, data=data), by)
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, text=label, data=data), by)
