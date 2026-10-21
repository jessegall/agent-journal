from journal.support.actor import Actor
from journal.support.card_kind import CardKind
from journal.models.author import Author
from journal.models.model import Model
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.models.support.row_card import RowCard
from journal.models.support.ref import Ref

DETAIL_CHARACTERS = 80

DOCKED = "docked"


class Cards:
    """A mark in the chat for a moment worth seeing: a check that ran, a trigger that fired, a question answered, a skill loaded, a halt. One funnel writes them, as messages of the system's, each one line with at most a short second line; the viewer draws each as a card by its kind."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def show(self, environment_id: int, session: str | None, label: str, icon: str, tone: str = "", detail: str = "", row: Ref | None = None, kind: str = "card", actor: Actor = Actor.system(), key: str = "", command: str = "", *, shows: CardKind) -> Message:
        fields = {"kind": kind, "icon": icon, "tone": tone, "row": str(row) if row else "", "command": command}
        return self.keyed(environment_id, key, label, fields if session is None else {**fields, "session": session}, actor, shows, detail)

    @staticmethod
    def creation_key(row: Model) -> str:
        return f"made:{row.noun()}:{row.id}"

    def creation_card(self, environment_id: int, row: Model, actor: Actor) -> Message:
        data = {"kind": "made", "session": actor.id, "made_type": row.table(), "n": row.id, **RowCard.build(row).as_data()}
        return self.keyed(environment_id, self.creation_key(row), row.title_words(), data, actor, CardKind.CREATED)

    def keyed(self, environment_id: int, key: str, label: str, data: dict, actor: Actor, shows: CardKind, detail: str = "") -> Message:
        data = {"session": "", "row": "", **data, **self.detail_parts(detail), "key": key, "shows": str(shows)}
        older = self.messages.keyed(key, actor) if key else []
        if older:
            return self.messages.save(older[0].with_(text=label, data=self.docked_data(older[0], data)), actor)
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, text=label, data=data), actor)

    @staticmethod
    def docked_data(older: Message, data: dict) -> dict:
        return {**data, DOCKED: older.data[DOCKED]} if DOCKED in older.data else data

    def detail_parts(self, detail: str) -> dict:
        lines = detail.strip().splitlines()
        if not lines:
            return {"detail": ""}
        head = {"detail": self.shortened(lines[0])}
        return head | {"lines": lines} if len(lines) > 1 else head

    @staticmethod
    def shortened(detail: str) -> str:
        line = detail.strip()
        if len(line) <= DETAIL_CHARACTERS:
            return line
        return line[:DETAIL_CHARACTERS].rsplit(" ", 1)[0].rstrip(",.") + "…"
