from features.acknowledgements.details import AcknowledgementsDetails
from features.acknowledgements.handlers import HideJournalOnlyTurns
from framework.base import Feature
from framework.journal import Journal
from events.agents import BusMessageSending
from expects import Given, Kept, Unchanged, Wrote
from payload import JOURNAL
from resources.types import AgentRow, Message, Nudge


class Acknowledgements(Feature):
    details = AcknowledgementsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(HideJournalOnlyTurns(), expects=[
            Given(BusMessageSending(agent=1, data={"text": "Noted.", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "delivered": ["nudge:2"]}), Nudge(n=2, title="a reminder")])
                >> Wrote(Message(n=1, title="Noted.", brief="Noted.", data={"acknowledgement": True})),
            Given(BusMessageSending(agent=1, data={"text": "Noted.", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": "the person", "delivered": ["nudge:2"]}), Nudge(n=2, title="a reminder")])
                >> Unchanged() & Kept(),
            Given(BusMessageSending(agent=1, data={"text": "Noted.", "turn": "t1"}),
                  earlier=(BusMessageSending(agent=1, data={"text": "Noted.", "turn": "t1"}),),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "delivered": ["nudge:2"]}), Nudge(n=2, title="a reminder")])
                >> Unchanged(),
            Given(BusMessageSending(agent=1, data={"text": "Got it, but which branch should I use?", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "delivered": ["nudge:2"]}), Nudge(n=2, title="a reminder")])
                >> Unchanged() & Kept(),
            Given(BusMessageSending(agent=1, data={"text": "Noted.", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "failure": "the turn failed", "delivered": ["nudge:2"]}), Nudge(n=2, title="a reminder")])
                >> Unchanged() & Kept(),
            Given(BusMessageSending(agent=1, data={"text": "Carrying on with it.", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "delivered": ["nudge:2"]}), Nudge(n=2, title="plan 3 stands still", data={"reply_kept": True})])
                >> Unchanged() & Kept(),
            Given(BusMessageSending(agent=1, data={"text": "Okay, on it.", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "delivered": ["message:7"]}), Message(n=7, title="can you look at this", seen=["user"])])
                >> Unchanged() & Kept(),
            Given(BusMessageSending(agent=1, data={"text": "That is the helper's earlier report.", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "delivered": ["message:7"]}), Message(n=7, title="helper 3 reported", seen=["agent"])])
                >> Wrote(Message(title="That is the helper's earlier report.", data={"acknowledgement": True})),
            Given(BusMessageSending(agent=1, data={"text": "On it: a hotfix is under way.", "turn": "t1"}),
                  rows=[AgentRow(n=1, data={"prompted": JOURNAL, "delivered": ["message:7"]}),
                        Message(n=7, title="a broken command here", seen=["agent"], data={"from_session": "uds:/tmp/b.sock"})])
                >> Unchanged() & Kept(),
        ])
