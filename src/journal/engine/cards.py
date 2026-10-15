import time

from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.repositories.entries import Entries

CARD = "card"


class Cards:
    """A mark in the chat for a moment worth seeing: a check that ran, a trigger that fired, a question answered, a skill loaded, a halt. One funnel writes them, as card entries; the viewer draws them on the agent's timeline."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def show(self, environment_id: int, session: str, label: str, icon: str, tone: str = "", detail: str = "", row: str = "", key: str = "") -> Entry:
        data = {"session": session, "label": label, "icon": icon, "tone": tone, "detail": detail, "row": row, "key": key or f"card:{time.time()}", "at": time.time()}
        return self.entries.save(Entry(environment_id=environment_id, kind=CARD, actor=Actor.system(), data=data), Actor.system())
