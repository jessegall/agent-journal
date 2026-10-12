from events import Fact
from events.agents import AgentMessageSent
from events.history_searches import SearchMade, SearchResultOpened, SearchResultReturned
from features.history_searches.listeners import open_key
from features.history_searches.searching import FOUND_LIMIT, KEPT_READS, OPEN, WAITING, labels, searches
from receiving import Handler
from resources.marks import Card
from resources.types import AgentRow
from serving import Clock, Remembered, Rows


def waiting_key(agent: int) -> str:
    return f"{WAITING}|{agent}"


def marked(agents: Rows[AgentRow], remembered: Remembered, clock: Clock, agent: int, command: str, found: str | None = None) -> list[str]:
    """One card for each search the command makes, with what it found once that is known; the keys are the cards'."""
    keys = []
    for number, one in enumerate(searches(command)):
        key = f"search-{int(clock.now() * 1e9)}-{number}"
        agents.card(agent, key=key, label=one.label, title=one.title, icon="search", tone="note", found=found and found[:FOUND_LIMIT])
        keys.append(key)
    if keys:
        remembered.set(open_key(agent), keys[-1])
    return keys


class MarkHistorySearch(Handler[SearchMade]):
    def handle(self, event: SearchMade, agents: Rows[AgentRow], remembered: Remembered, clock: Clock) -> list[Fact]:
        keys = marked(agents, remembered, clock, event.agent, event.command)
        remembered.set(waiting_key(event.agent), [*(remembered.get(waiting_key(event.agent)) or []), {"labels": labels(event.command), "keys": keys}])
        return []


class KeepSearchResult(Handler[SearchResultReturned]):
    def handle(self, event: SearchResultReturned, agents: Rows[AgentRow], remembered: Remembered, clock: Clock) -> list[Fact]:
        """What a search found goes to the cards of that search, whichever searches ran at the same time; a search whose marks are not there yet gets them now."""
        waiting = remembered.get(waiting_key(event.agent)) or []
        mine = next((entry for entry in waiting if entry["labels"] == labels(event.command)), None)
        if mine is None:
            marked(agents, remembered, clock, event.agent, event.command, event.output)
            return []
        remembered.set(waiting_key(event.agent), [entry for entry in waiting if entry is not mine])
        remembered.set(open_key(event.agent), mine["keys"][-1])
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
        remembered.set(open_key(event.agent), "")
        remembered.set(waiting_key(event.agent), [])
        return []
