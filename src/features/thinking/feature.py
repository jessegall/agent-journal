from events.agents import AgentReported
from framework.base import Feature
from events.agents import AgentMessageSent
from expects import Given, Unchanged, Updated
from framework.journal import Journal
from resources.types import AgentRow
from features.thinking.details import ThinkingDetails
from features.thinking.handlers import ClearOnMessage, FollowThinking


class Thinking(Feature):
    details = ThinkingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(FollowThinking(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(ClearOnMessage(), expects=[
            Given(AgentMessageSent(agent=1, text="Done with the header."), rows=[AgentRow(n=1, data={"thinking": "weighing the header"})])
                >> Updated(AgentRow(n=1), thinking=""),
            Given(AgentMessageSent(agent=1, text="  "), rows=[AgentRow(n=1, data={"thinking": "weighing the header"})])
                >> Unchanged(),
            Given(AgentMessageSent(agent=1, text="Done with the header."), rows=[AgentRow(n=1)])
                >> Unchanged(),
        ])
