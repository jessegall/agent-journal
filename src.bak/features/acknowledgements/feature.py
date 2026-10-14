from features.acknowledgements.details import KEPT_OUT, AcknowledgementsDetails
from features.acknowledgements.handlers import ExplainTheWithholding, FileTheAcknowledgement, KeepTheSentTurn
from features.acknowledgements.listeners import KeepNodsOutOfTheChat, SpotNods, SpotTurnSent
from framework.base import Feature
from framework.journal import Journal
from events.acknowledgements import FirstNodWithheld, NodWithheld, TurnReachedChat
from events.agents import AgentMessageSent, AgentTurnWritten
from events.answers import Allowed, Kept
from events.asking import AgentMessageSending
from expects import Answered, Dispatches, Given, Nudged, Remembered, Wrote, nothing
from payload import JOURNAL
from resources.types import AgentRow, Message, Nudge

REMINDER = Nudge(n=2, title="a reminder")


def prompted(by: str = JOURNAL, delivered: str = "nudge:2", **more) -> AgentRow:
    return AgentRow(n=1, title="claude-1", data={"prompted": by, "delivered": [delivered], **more})


def sending(text: str) -> AgentMessageSending:
    return AgentMessageSending(text=text, turn="t1", session="claude-1")


class Acknowledgements(Feature):
    details = AcknowledgementsDetails

    def register(self, journal: Journal) -> None:
        journal.events.answer(AgentMessageSending, KeepNodsOutOfTheChat(), expects=[
            Given(sending("Noted."), rows=[prompted(), REMINDER]) >> Answered(Kept()),
            Given(sending("Noted."), rows=[prompted(by="the person"), REMINDER]) >> Answered(Allowed()),
            Given(sending("Got it, but which branch should I use?"), rows=[prompted(), REMINDER]) >> Answered(Allowed()),
            Given(sending("Noted."), rows=[prompted(failure="the turn failed"), REMINDER]) >> Answered(Allowed()),
            Given(sending("Carrying on with it."), rows=[prompted(), Nudge(n=2, title="plan 3 stands still", data={"reply_kept": True})]) >> Answered(Allowed()),
            Given(sending("Okay, on it."), rows=[prompted(delivered="message:7"), Message(n=7, title="can you look at this", seen=["user"])]) >> Answered(Allowed()),
            Given(sending("That is the helper's earlier report."), rows=[prompted(delivered="message:7"), Message(n=7, title="helper 3 reported", seen=["agent"])])
                >> Answered(Kept()),
            Given(sending("On it: a hotfix is under way."), rows=[prompted(delivered="message:7"),
                                                                   Message(n=7, title="a broken command here", seen=["agent"], data={"from_session": "uds:/tmp/b.sock"})])
                >> Answered(Allowed()),
            Given(sending("Looking at it now."), rows=[prompted(turn_wrote=True), REMINDER], remembered={"acknowledgements.sent|1": "t1"}) >> Answered(Kept()),
            Given(sending("Looking at it now."), rows=[prompted(turn_wrote=True), REMINDER], remembered={"acknowledgements.sent|1": "t0"}) >> Answered(Allowed()),
        ])
        journal.events.listen(AgentMessageSent, SpotTurnSent(), expects=[
            Given(AgentMessageSent(agent=1, turn="t1", text="Looking at it now."), rows=[prompted()]) >> Dispatches(TurnReachedChat(agent=1, turn="t1")),
        ])
        journal.events.handle(TurnReachedChat, KeepTheSentTurn(), expects=[
            Given(TurnReachedChat(agent=1, turn="t1"), rows=[prompted()]) >> Remembered("sent|1", "t1"),
        ])
        journal.events.listen(AgentTurnWritten, SpotNods(), expects=[
            Given(AgentTurnWritten(agent=1, turn="t1", text="Noted."), rows=[prompted(), REMINDER])
                >> Dispatches(FirstNodWithheld(agent=1).once("kept out|claude-1")) & Dispatches(NodWithheld(agent=1, turn="t1", text="Noted.").once("nudge:2:Noted.")),
            Given(AgentTurnWritten(agent=1, turn="t1", text="Noted."), rows=[prompted(by="the person"), REMINDER]) >> Dispatches(nothing),
            Given(AgentTurnWritten(agent=1, turn="t1", text="  "), rows=[prompted(), REMINDER]) >> Dispatches(nothing),
        ])
        journal.events.handle(NodWithheld, FileTheAcknowledgement(), expects=[
            Given(NodWithheld(agent=1, turn="t1", text="Noted."), rows=[prompted()]) >> Wrote(Message(title="Noted.", brief="Noted.", data={"acknowledgement": True})),
        ])
        journal.events.handle(FirstNodWithheld, ExplainTheWithholding(), expects=[
            Given(FirstNodWithheld(agent=1), rows=[prompted()]) >> Nudged(KEPT_OUT),
        ])
