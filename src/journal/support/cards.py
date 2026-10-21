from journal.support.actor import Actor
from journal.support.chat_mark import ChatMark
from journal.models.author import Author
from journal.models.model import Model
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.support.row_card import RowCard


class Cards:
    """A mark in the chat for a moment worth seeing: a check that ran, a trigger that fired, a question answered, a skill loaded, a halt. One funnel writes them, as messages of the system's; the viewer draws each as a card by its kind."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def show(self, environment_id: int, session: str, label: str, icon: str, tone: str = "", detail: str = "", row: str = "", kind: str = "card", actor: Actor = Actor.system(), key: str = "", command: str = "", *, shows: ChatMark) -> Message:
        return self.keyed(environment_id, key, label, {"kind": kind, "session": session, "icon": icon, "tone": tone, "detail": detail, "row": row, "command": command}, actor, shows)

    @staticmethod
    def made_key(row: Model) -> str:
        return f"made:{row.noun()}:{row.id}"

    def made_mark(self, environment_id: int, row: Model, actor: Actor) -> Message:
        data = {"kind": "made", "session": actor.id, "made_type": row.table(), "n": row.id, **RowCard.of(row).as_data()}
        return self.keyed(environment_id, self.made_key(row), row.title_words(), data, actor, ChatMark.CREATED)

    def keyed(self, environment_id: int, key: str, label: str, data: dict, actor: Actor, shows: ChatMark) -> Message:
        data = {"session": "", "row": "", **data, "key": key, "shows": str(shows)}
        earlier = self.messages.keyed(key, actor) if key else []
        if earlier:
            return self.messages.save(earlier[0].with_(text=label, data=data), actor)
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, text=label, data=data), actor)
