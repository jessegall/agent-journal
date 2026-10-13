from events.agents import SessionStarted
from events.boards import BoardOrchestrated
from expects import Answered, Dispatches, Given, Nudged, Unchanged, nothing
from events.resources import AnyEvent
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow, Environment
from events.answers import Allowed, Rewritten
from events.asking import HookResponding
from features.session_briefing.answering import BriefTheSession
from declaring.registries import SETTINGS_APPLIED
from features.session_briefing.block import COMPACTED, rebuild
from framework.lanes import TheJournalRoot
from features.session_briefing.details import SessionBriefingDetails
from payload import HookEvent
from events.session_briefing import SessionGreeted, StartBlockStale
from features.session_briefing.handlers import GreetTheSession, RebuildTheStartBlock
from features.session_briefing.listeners import SpotChangeToTheStartBlock, SpotOrchestrationChange, SpotSessionToGreet, stale


CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})


class Written:
    def __eq__(self, answer) -> bool:
        return isinstance(answer, Rewritten) and bool(answer.text) and not answer.text.startswith(COMPACTED)


class Opening:
    def __init__(self, text: str) -> None:
        self.text = text

    def __eq__(self, answer) -> bool:
        return isinstance(answer, Rewritten) and answer.text.startswith(self.text)


class SessionBriefing(Feature):
    details = SessionBriefingDetails

    def register(self, journal: Journal) -> None:
        SETTINGS_APPLIED.add(self, lambda record: rebuild(record, TheJournalRoot(record)))
        journal.events.listen(SessionStarted, SpotSessionToGreet(), expects=[
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(SessionGreeted(agent=1, env="t").once("greeted|ready|1")),
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1"), Environment(n=1, title="t", data={"owner": "ticket:5"})]) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1"), Environment(n=1, title="t")]) >> Dispatches(SessionGreeted(agent=1, env="t").once("greeted|ready|1")),
        ])
        journal.events.handle(SessionGreeted, GreetTheSession(), expects=[
            Given(SessionGreeted(agent=1, env="t"), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("ready", env="t"),
        ])
        journal.events.listen(AnyEvent, SpotChangeToTheStartBlock(), expects=[
            Given(AnyEvent(n=1, type="fact", action="created")) >> Dispatches(stale()),
            Given(AnyEvent(n=1, type="feature", action="updated")) >> Dispatches(stale()),
            Given(AnyEvent(n=1, type="nudge", action="created")) >> Dispatches(nothing),
            Given(AnyEvent(n=1, type="fact", action="updated", section="2 · why")) >> Dispatches(nothing),
            Given(AnyEvent(n=1, type="fact", action="updated", by="read")) >> Dispatches(nothing),
        ])
        journal.events.listen(BoardOrchestrated, SpotOrchestrationChange(), expects=[
            Given(BoardOrchestrated(n=0, type="board", action="orchestrated", orchestrating=True)) >> Dispatches(stale()),
        ])
        journal.events.handle(StartBlockStale, RebuildTheStartBlock(), expects=[
            Given(StartBlockStale()) >> Unchanged(),
        ])
        journal.events.answer(HookResponding, BriefTheSession(), expects=[
            Given(HookResponding(event="SessionStart", session="claude-1"), rows=[CLAUDE]) >> Answered(Written()),
            Given(HookResponding(event="SessionStart", session="claude-1", compacted=True), rows=[CLAUDE]) >> Answered(Opening(COMPACTED)),
            Given(HookResponding(event="PreToolUse", session="claude-1"), rows=[CLAUDE]) >> Answered(Allowed()),
        ])
