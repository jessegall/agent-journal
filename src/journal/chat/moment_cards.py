from journal.chat.card_detail import CardDetail
from journal.models.author import Author
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.repositories.messages import Messages
from journal.support.actor import Actor
from journal.support.card_kind import CardKind

MOMENT = "moment"


class MomentCards:
    """A card in the chat for a moment, shown as it was: a task moved, a skill loaded, a check that ran. Each is a new message of the system's, and nothing updates it."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def show(self, environment_id: int, session: str | None, label: str, icon: str, tone: str = "", detail: str = "", row: Ref | None = None, kind: str = "card", actor: Actor = Actor.system(), key: str = "", command: str = "", *, shows: CardKind) -> Message:
        data = {"kind": kind, "icon": icon, "tone": tone, "row": str(row) if row else "", "command": command}
        return self.show_fields(environment_id, session, label, data, actor, shows, detail, key)

    def show_fields(self, environment_id: int, session: str | None, label: str, data: dict, actor: Actor, shows: CardKind, detail: str = "", key: str = "") -> Message:
        data = {"row": "", **data, **CardDetail.parts(detail), "key": key, "shows": str(shows), "card_type": MOMENT}
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, session=session or None, text=label, data=data), actor)

    def is_shown(self, key: str, actor: Actor) -> bool:
        return bool(self.messages.keyed(key, actor))
