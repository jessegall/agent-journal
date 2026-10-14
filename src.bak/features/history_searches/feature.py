from events.agents import AgentMessageSent, CommandRan, ToolCallAnswered
from events.history_searches import SearchMade, SearchResultOpened, SearchResultReturned
from expects import WHEN, Dispatches, Given, Remembered, Updated, nothing
from framework.base import Feature
from features.history_searches.details import HistorySearchesDetails
from features.history_searches.handlers import EndSearchReads, KeepSearchRead, KeepSearchResult, MarkHistorySearch
from features.history_searches.listeners import SpotSearch, SpotSearchOutcome
from framework.journal import Journal
from resources.types import AgentRow

AGENT_ROW = AgentRow(n=1, title="claude-1")
SEARCH = 'journal search "phone link"'
LABEL = 'Searched the conversation for "phone link"'
KEY = f"search-{int(WHEN * 1e9)}-0"
MARKED = AgentRow(n=1, title="claude-1", data={"cards": [{"key": "search-1", "label": LABEL}]})
OPEN = {"history_searches.open|1": "search-1"}
WAITING = {"history_searches.waiting|1": [{"labels": [LABEL], "keys": ["search-1"]}]}


def answered(command: str, tool: str = "Bash", why: str = "", subagent: bool = False) -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool=tool, input=command, command=command if tool == "Bash" else "", why=why, subagent=subagent)


def ran(command: str, output: str = "", tool: str = "Bash") -> CommandRan:
    return CommandRan(agent=1, tool=tool, command=command, output=output)


class HistorySearches(Feature):
    details = HistorySearchesDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ToolCallAnswered, SpotSearch(), expects=[
            Given(answered(f'cd x && {SEARCH} 2>&1 | head -5'), rows=[AGENT_ROW]) >> Dispatches(SearchMade(agent=1, command=f'cd x && {SEARCH} 2>&1 | head -5')),
            Given(answered("journal --env main conversation --back=1"), rows=[AGENT_ROW]) >> Dispatches(SearchMade(agent=1, command="journal --env main conversation --back=1")),
            Given(answered("journal user | tail"), rows=[AGENT_ROW]) >> Dispatches(SearchMade(agent=1, command="journal user | tail")),
            Given(answered("journal todo all"), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(answered("grep journal search.py"), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(answered("git status"), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(answered(SEARCH, why="plan 4 is open"), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(answered(SEARCH, tool="Read"), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(answered(SEARCH, subagent=True), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(SearchMade, MarkHistorySearch(), expects=[
            Given(SearchMade(agent=1, command=SEARCH), rows=[AGENT_ROW])
                >> Updated(AgentRow(n=1), cards=[{"key": KEY, "label": LABEL, "icon": "search"}])
                & Remembered("open|1", KEY) & Remembered("waiting|1", [{"labels": [LABEL], "keys": [KEY]}]),
        ])
        journal.events.listen(CommandRan, SpotSearchOutcome(), expects=[
            Given(ran(SEARCH, "todo 12 phone link"), rows=[AGENT_ROW]) >> Dispatches(SearchResultReturned(agent=1, command=SEARCH, output="todo 12 phone link")),
            Given(ran("journal todo show 12", "Title: phone link"), rows=[MARKED], remembered=OPEN)
                >> Dispatches(SearchResultOpened(agent=1, key="search-1", label="Opened todo 12", text="Title: phone link")),
            Given(ran("reading a.py /x/a.py", "print(1)", tool="Read"), rows=[MARKED], remembered=OPEN)
                >> Dispatches(SearchResultOpened(agent=1, key="search-1", label="Read /x/a.py", text="print(1)")),
            Given(ran("ls", "a.py"), rows=[MARKED], remembered=OPEN) >> Dispatches(nothing),
            Given(ran("journal todo show 12", "Title: phone link"), rows=[MARKED]) >> Dispatches(nothing),
            Given(ran("journal todo show 12", "Title: phone link"), rows=[AGENT_ROW], remembered=OPEN) >> Dispatches(nothing),
        ])
        journal.events.handle(SearchResultReturned, KeepSearchResult(), expects=[
            Given(SearchResultReturned(agent=1, command=SEARCH, output="todo 12 phone link"), rows=[MARKED], remembered=WAITING)
                >> Updated(AgentRow(n=1), cards=[{"key": "search-1", "found": "todo 12 phone link"}]) & Remembered("waiting|1", []) & Remembered("open|1", "search-1"),
            Given(SearchResultReturned(agent=1, command=SEARCH, output="todo 12 phone link"), rows=[AGENT_ROW])
                >> Updated(AgentRow(n=1), cards=[{"key": KEY, "label": LABEL, "found": "todo 12 phone link"}]) & Remembered("open|1", KEY),
        ])
        journal.events.handle(SearchResultOpened, KeepSearchRead(), expects=[
            Given(SearchResultOpened(agent=1, key="search-1", label="Opened todo 12", text="Title: phone link"), rows=[MARKED])
                >> Updated(AgentRow(n=1), cards=[{"key": "search-1", "reads": [{"label": "Opened todo 12", "text": "Title: phone link"}]}]),
        ])
        journal.events.handle(AgentMessageSent, EndSearchReads(), expects=[
            Given(AgentMessageSent(agent=1, text="Done", turn="t1"), rows=[MARKED], remembered={**OPEN, **WAITING}) >> Remembered("open|1", "") & Remembered("waiting|1", []),
        ])
