from events.agents import AgentMessageSent, AgentReported
from events.thinking import ThinkingCleared, TranscriptRead
from expects import WHEN, Dispatches, Given, Remembered, Updated, nothing
from features.thinking.details import ThinkingDetails
from features.thinking.handlers import ClearTheThought, ShowTheThoughts
from features.thinking.listeners import FollowTheTranscript, SpotVisibleMessage
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow

AGENT = AgentRow(n=1, title="claude-1")
HOLDING = AgentRow(n=1, title="claude-1", data={"thinking": "Earlier", "thoughts": [{"at": 1.0, "text": "Earlier"}]})
OLD = [{"at": float(i), "text": f"t{i}"} for i in range(60)]


class Thinking(Feature):
    details = ThinkingDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentReported, FollowTheTranscript(), expects=[
            Given(AgentReported(agent=1), rows=[AGENT]) >> Dispatches(nothing),
        ])
        journal.events.handle(TranscriptRead, ShowTheThoughts(), expects=[
            Given(TranscriptRead(agent=1, path="s.jsonl", offset=40, thinking="Second", thoughts=("First", "Second")), rows=[AGENT])
                >> Updated(AgentRow(n=1), thinking="Second", thoughts=[{"at": WHEN, "text": "First"}, {"at": WHEN, "text": "Second"}])
                & Remembered("transcript|claude-1", {"path": "s.jsonl", "offset": 40}),
            Given(TranscriptRead(agent=1, path="s.jsonl", offset=40, thinking=""), rows=[AGENT]) >> Remembered("transcript|claude-1", {"path": "s.jsonl", "offset": 40}),
            Given(TranscriptRead(agent=1, path="s.jsonl", offset=40, thinking="Later", thoughts=("Later",)), rows=[HOLDING])
                >> Updated(AgentRow(n=1), thinking="Later", thoughts=[{"at": 1.0, "text": "Earlier"}, {"at": WHEN, "text": "Later"}]),
            Given(TranscriptRead(agent=1, path="s.jsonl", offset=40, thinking=""), rows=[HOLDING])
                >> Updated(AgentRow(n=1), thinking="") & Remembered("transcript|claude-1", {"path": "s.jsonl", "offset": 40}),
            Given(TranscriptRead(agent=1, path="s.jsonl", offset=40, thoughts=("x" * 2000,)), rows=[AGENT]) >> Updated(AgentRow(n=1), thoughts=[{"at": WHEN, "text": "x" * 1200}]),
            Given(TranscriptRead(agent=1, path="s.jsonl", offset=40, thoughts=("new",)), rows=[AgentRow(n=1, title="claude-1", data={"thoughts": OLD})])
                >> Updated(AgentRow(n=1), thoughts=[*OLD[1:], {"at": WHEN, "text": "new"}]),
        ])
        journal.events.listen(AgentMessageSent, SpotVisibleMessage(), expects=[
            Given(AgentMessageSent(agent=1, text="Done with the header."), rows=[AgentRow(n=1, data={"thinking": "weighing the header"})]) >> Dispatches(ThinkingCleared(agent=1)),
            Given(AgentMessageSent(agent=1, text="  "), rows=[AgentRow(n=1, data={"thinking": "weighing the header"})]) >> Dispatches(nothing),
            Given(AgentMessageSent(agent=1, text="Done with the header."), rows=[AgentRow(n=1)]) >> Dispatches(nothing),
        ])
        journal.events.handle(ThinkingCleared, ClearTheThought(), expects=[
            Given(ThinkingCleared(agent=1), rows=[AgentRow(n=1, data={"thinking": "weighing the header"})]) >> Updated(AgentRow(n=1), thinking=""),
        ])
