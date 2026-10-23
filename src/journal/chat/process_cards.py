from journal.chat.card_detail import CardDetail
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.support.actor import Actor
from journal.support.card_kind import CardKind

PROCESS = "process"
DOCKED = "docked"
AUTO_DOCKED = "auto_docked"


class ProcessCards:
    """Writes every process card: one message per process, found again by its key and updated in place, its data naming the process card class that refreshes it and whether its process still runs."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def show(self, process: str, environment_id: int, key: str, label: str, data: dict, actor: Actor, shows: CardKind, active: bool, detail: str = "", session: str | None = None) -> Message:
        data = {"row": "", **data, **CardDetail.parts(detail), "key": key, "shows": str(shows), "card_type": PROCESS, "process": process, "active": active}
        older = self.messages.keyed(key, actor)
        if older:
            return self.messages.save(older[0].with_(text=label, session=session or older[0].session, data=self.docked_data(older[0], data)), actor)
        return self.messages.save(Message(environment_id=environment_id, author=Author.SYSTEM, session=session or None, text=label, data=data), actor)

    def show_recent(self, process: str, environment_id: int, key: str, label: str, data: dict, actor: Actor, shows: CardKind, active: bool, detail: str = "", session: str | None = None) -> Message:
        older = self.messages.keyed(key, actor)
        if older and self.predates_user_message(older[0]):
            self.messages.delete(older[0], actor)
        return self.show(process, environment_id, key, label, data, actor, shows, active, detail, session)

    def predates_user_message(self, card: Message) -> bool:
        latest = self.messages.last_user_message()
        return latest is not None and card.row_id < latest.row_id

    @staticmethod
    def docked_data(older: Message, data: dict) -> dict:
        return {**{key: older.data[key] for key in (DOCKED, AUTO_DOCKED) if key in older.data}, **data}
