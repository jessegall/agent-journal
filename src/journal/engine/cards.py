from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages


class Cards:
    """A mark in the chat for a moment worth seeing: a check that ran, a trigger that fired, a question answered, a skill loaded, a halt. One funnel writes them, as messages of the system's; the viewer draws each as a card by its kind."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def show(self, environment_id: int, session: str, label: str, icon: str, tone: str = "", detail: str = "", row: str = "", kind: str = "card") -> Message:
        data = {"kind": kind, "session": session, "icon": icon, "tone": tone, "detail": detail, "row": row}
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, text=label, data=data), Actor.system())
