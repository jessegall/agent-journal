from events import Fact
from events.agents import CommandRan, ToolCallAnswered
from events.history_searches import SearchMade, SearchResultOpened, SearchResultReturned
from features.history_searches.searching import READ_LIMIT, SHELL, Marks, opened, searches
from receiving import Listener
from resources.types import AgentRow
from serving import ReadRemembered, ReadRows


class SpotSearch(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered) -> list[Fact]:
        if event.tool != SHELL or event.why or event.subagent or not searches(event.input):
            return []
        return [SearchMade(agent=event.agent, command=event.input)]


class SpotSearchOutcome(Listener[CommandRan]):
    def listen(self, event: CommandRan, remembered: ReadRemembered, agents: ReadRows[AgentRow]) -> list[Fact]:
        if event.tool == SHELL and searches(event.command):
            return [SearchResultReturned(agent=event.agent, command=event.command, output=event.output)]
        key, label = Marks(remembered, event.agent).open, opened(event)
        if not key or not label or not any(card.get("key") == key for card in agents.peek(event.agent).data.get("cards") or []):
            return []
        return [SearchResultOpened(agent=event.agent, key=key, label=label, text=event.output[:READ_LIMIT])]
