from events.agents import AgentMessageSent, CommandRan
from expects import Given, Kept, Unchanged
from framework.base import Feature
from features.history_searches.details import HistorySearchesDetails
from features.history_searches.handlers import EndSearchReads, KeepSearchResults, MarkHistorySearches
from framework.journal import Journal
from payload import BashCall
from resources.types import AgentRow

AGENT_ROW = AgentRow(n=1, title="claude-1")


class HistorySearches(Feature):
    details = HistorySearchesDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(MarkHistorySearches(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "git status"}, {}), rows=[AGENT_ROW]) >> Kept() & Unchanged(),
            Given(BashCall.from_payload("Bash", {"command": "journal todo show 7"}, {}), rows=[AGENT_ROW]) >> Kept() & Unchanged(),
        ])

        journal.events.handler(KeepSearchResults(), expects=[
            Given(CommandRan(agent=1, tool="Bash", command="git status", output="clean"), rows=[AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(EndSearchReads(), expects=[
            Given(AgentMessageSent(agent=1, text="Done", turn="t1"), rows=[AGENT_ROW]) >> Unchanged(),
        ])
