from events import Fact
from events.agents import AgentMessageSent
from events.history_searches import SearchMade, SearchResultOpened, SearchResultReturned
from features.history_searches.searching import FOUND_LIMIT, KEPT_READS, Marks, labels, searches
from receiving import Handler
from resources.marks import Card
from resources.types import AgentRow
from serving import Clock, Remembered, Rows


def search_cards(agents: Rows[AgentRow], marks: Marks, clock: Clock, command: str, found: str | None = None) -> list[str]:
    """One card for each search the command makes, with what it found once that is known; the keys are the cards'."""
    keys = []
    for number, one in enumerate(searches(command)):
        key = f"search-{int(clock.now() * 1e9)}-{number}"
        agents.card(marks.agent, key=key, label=one.label, title=one.title, icon="search", tone="note", found=found and found[:FOUND_LIMIT])
        keys.append(key)
    if keys:
        marks.open = keys[-1]
    return keys


class MarkHistorySearch(Handler[SearchMade]):
    def handle(self, event: SearchMade, agents: Rows[AgentRow], remembered: Remembered, clock: Clock) -> list[Fact]:
        marks = Marks(remembered, event.agent)
        keys = search_cards(agents, marks, clock, event.command)
        marks.waiting = [*marks.waiting, {"labels": labels(event.command), "keys": keys}]
        return []


class KeepSearchResult(Handler[SearchResultReturned]):
    """What a search found goes to the cards of that search; a search whose cards are not there yet gets them now."""

    def handle(self, event: SearchResultReturned, agents: Rows[AgentRow], remembered: Remembered, clock: Clock) -> list[Fact]:
        marks = Marks(remembered, event.agent)
        mine = next((entry for entry in marks.waiting if entry["labels"] == labels(event.command)), None)
        if mine is None:
            search_cards(agents, marks, clock, event.command, event.output)
            return []
        marks.waiting = [entry for entry in marks.waiting if entry is not mine]
        marks.open = mine["keys"][-1]
        for key in mine["keys"]:
            agents.card(event.agent, key=key, found=event.output[:FOUND_LIMIT])
        return []


class KeepSearchRead(Handler[SearchResultOpened]):
    def handle(self, event: SearchResultOpened, agents: Rows[AgentRow]) -> list[Fact]:
        card = next(kept for kept in agents.load(event.agent).data.get("cards") or [] if kept.get("key") == event.key)
        reads = [*Card.of_data(card).reads, {"label": event.label, "text": event.text}]
        agents.card(event.agent, key=event.key, reads=reads[:KEPT_READS])
        return []


class EndSearchReads(Handler[AgentMessageSent]):
    def handle(self, event: AgentMessageSent, remembered: Remembered) -> list[Fact]:
        marks = Marks(remembered, event.agent)
        marks.open = ""
        marks.waiting = []
        return []
