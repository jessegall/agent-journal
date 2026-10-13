from events import Fact
from events.triggers import ChatWordDenied, TriggerMet, TriggerHolding, TriggerReleased, TriggerShowing
from features.triggers.listeners import sent_key
from framework.format import read_as
from receiving import Handler
from resources.triggers import DENY, INSTRUCT, MESSAGE, NUDGE, START, Trigger, holding
from resources.types import AgentRow
from serving import Chat, Remembered, Rows

DONE = {MESSAGE: "sent a message", NUDGE: "nudged the agent", INSTRUCT: "instructed the agent", DENY: "denied the call", START: "started its sequence", "hold": "held the agent"}


class FireTrigger(Handler[TriggerMet]):
    def handle(self, event: TriggerMet, triggers: Rows[Trigger], agents: Rows[AgentRow], chat: Chat) -> list[Fact]:
        row = read_as(triggers.load(event.row), triggers.record)
        if row.does != START:
            agents.card(event.agent, label=f"Trigger {row.title} {event.done or DONE[row.does]}", icon=Trigger.icon, tone="danger" if row.does == DENY else "note",
                        title=row.wording, ref=row.ref)
        if row.does == MESSAGE:
            chat.post_as_user(row.title, row.brief or row.text, row=row.n)
        elif row.does in (NUDGE, INSTRUCT):
            chat.say(row.does, private=True, title=row.title, text=row.wording)
        triggers.fired(row.n, event.about)
        return []


class DenyWordInChat(Handler[ChatWordDenied]):
    def handle(self, event: ChatWordDenied, triggers: Rows[Trigger], chat: Chat) -> list[Fact]:
        row = triggers.load(event.row)
        chat.nudge("denied", title=row.title, text=row.wording)
        return []


class SayWhatTheJournalShows(Handler[TriggerShowing]):
    def handle(self, event: TriggerShowing, chat: Chat, remembered: Remembered) -> list[Fact]:
        chat.say(event.does, private=True, **dict(event.values))
        remembered.set(sent_key(event.row, event.key), remembered.get(sent_key(event.row, event.key), 0) + 1)
        return []


class HoldWhileTheJournalShows(Handler[TriggerHolding]):
    def handle(self, event: TriggerHolding, chat: Chat) -> list[Fact]:
        chat.hold("held", holding(event.row), title=event.title, text=event.text)
        return []


class ReleaseWhenTheJournalStopsShowing(Handler[TriggerReleased]):
    def handle(self, event: TriggerReleased, chat: Chat) -> list[Fact]:
        chat.release(holding(event.row))
        return []
