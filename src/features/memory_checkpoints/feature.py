from controllers.types import Rules
from events.agents import AgentChanged, AgentReported
from events.memory_checkpoints import AgentKeptSomething, ContextDecided, ContextMarkReached
from events.resources import ResourceCreated
from expects import Released, WHEN, Answered, Dispatches, Given, Held, Nudged, Remembered, Updated, nothing
from framework.base import Feature
from features.memory_checkpoints.commands import Reread
from features.memory_checkpoints.details import MemoryCheckpointsDetails
from features.memory_checkpoints.handlers import HoldUntilDecided, MarkWhatWasKept, ReleaseOnceDecided
from features.memory_checkpoints.listeners import DecideAtMarks, DecideAtMarksOnChange, SpotDecision, SpotWhatWasKept
from features.memory_checkpoints.reread import owed_reading
from framework.sending import Nudge
from framework.journal import Journal
from resources.types import AgentRow, Fact, Reminder, Rule


class MemoryCheckpoints(Feature):
    details = MemoryCheckpointsDetails
    nudges = (Nudge("reread", behaviour="rereading", about=owed_reading, private=False,
                    guarantee="When the weekly reading of every rule and fact is owed, the agent is told to do it."),)

    def register(self, journal: Journal) -> None:
        journal.commands.add("rule", Reread(), expects=[
            Given((Rules,)) >> Answered("") & Remembered("cleanup_read_at", WHEN),
            Given((Rules,), rows=[Rule(n=3, title="Never merge the refactor", brief="until the user approves"), Fact(n=9, title="Old claim", completed=WHEN - 10)])
                >> Answered("rule 3  Never merge the refactor\nuntil the user approves") & Remembered("cleanup_read_at", WHEN),
            Given((Rules,), rows=[Rule(n=3, title="Never merge the refactor", brief="until the user approves"), Fact(n=9, title="The viewer runs from dist")])
                >> Answered("rule 3  Never merge the refactor\nuntil the user approves\n\nfact 9  The viewer runs from dist") & Remembered("cleanup_read_at", WHEN),
        ])
        journal.events.listen(AgentReported, DecideAtMarks(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, data={"context": 60})]) >> Dispatches(ContextMarkReached(agent=1, percent=60).due()),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, data={"context": 60, "decided": 60})]) >> Dispatches(ContextDecided(agent=1)),
        ])
        journal.events.listen(AgentChanged, DecideAtMarksOnChange(), expects=[
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, data={"context": 60})]) >> Dispatches(ContextMarkReached(agent=1, percent=60).due()),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, data={"context": 60, "decided": 60})]) >> Dispatches(ContextDecided(agent=1)),
            Given(AgentChanged(agent=1, action="created"), rows=[AgentRow(n=1, data={"context": 60})]) >> Dispatches(nothing),
        ])
        journal.events.listen(ResourceCreated, SpotDecision(), expects=[
            Given(ResourceCreated(n=4, type="fact", actor="agent"), rows=[AgentRow(n=1), Fact(n=4, title="a claim")]) >> Dispatches(ContextDecided(agent=1)),
            Given(ResourceCreated(n=4, type="rule", actor="agent"), rows=[AgentRow(n=1), Rule(n=4, title="a ruling")]) >> Dispatches(ContextDecided(agent=1)),
            Given(ResourceCreated(n=4, type="fact", actor="agent"), rows=[AgentRow(n=1), AgentRow(n=2, title="claude-2"), Fact(n=4, title="a claim")])
                >> Dispatches(ContextDecided(agent=1)) & Dispatches(ContextDecided(agent=2)),
            Given(ResourceCreated(n=4, type="todo", actor="agent"), rows=[AgentRow(n=1)]) >> Dispatches(nothing),
            Given(ResourceCreated(n=4, type="fact", actor="user"), rows=[AgentRow(n=1), Fact(n=4, title="a claim")]) >> Dispatches(ContextDecided(agent=1)),
            Given(ResourceCreated(n=4, type="fact", actor="agent"), rows=[Fact(n=4, title="a claim")]) >> Dispatches(nothing),
        ])
        journal.events.listen(ResourceCreated, SpotWhatWasKept(), expects=[
            Given(ResourceCreated(n=4, type="fact", actor="agent"), rows=[AgentRow(n=1), Fact(n=4, title="the viewer runs from dist")])
                >> Dispatches(AgentKeptSomething(agent=1, label="Wrote a fact", icon="pin", detail="the viewer runs from dist", ref="fact:4")),
            Given(ResourceCreated(n=4, type="fact", actor="user"), rows=[AgentRow(n=1), Fact(n=4, title="the viewer runs from dist")]) >> Dispatches(nothing),
            Given(ResourceCreated(n=4, type="rule", actor="agent"), rows=[AgentRow(n=1), Rule(n=4, title="a ruling")])
                >> Dispatches(AgentKeptSomething(agent=1, label="Wrote a rule", icon="list", detail="a ruling", ref="rule:4")),
            Given(ResourceCreated(n=4, type="reminder", actor="agent"), rows=[AgentRow(n=1), Reminder(n=4, title="say it again")])
                >> Dispatches(AgentKeptSomething(agent=1, label="Set a reminder", icon="clock", detail="say it again", ref="reminder:4")),
            Given(ResourceCreated(n=4, type="fact", actor="agent"), rows=[Fact(n=4, title="a claim")]) >> Dispatches(nothing),
            Given(ResourceCreated(n=4, type="todo", actor="agent"), rows=[AgentRow(n=1)]) >> Dispatches(nothing),
        ])
        journal.events.handle(ContextMarkReached, HoldUntilDecided(), expects=[
            Given(ContextMarkReached(agent=1, percent=60), rows=[AgentRow(n=1, data={"context": 60})])
                >> Held("context 60% full — decide before any other write — journal fact, journal rule, or journal nothing \"<why>\"") & Nudged("decide", percent=60),
        ])
        journal.events.handle(ContextDecided, ReleaseOnceDecided(), expects=[
            Given(ContextDecided(agent=1), rows=[AgentRow(n=1, data={"context": 60, "decided": 60})], held="context 60% full") >> Dispatches(nothing) & Released(),
        ])
        journal.events.handle(AgentKeptSomething, MarkWhatWasKept(), expects=[
            Given(AgentKeptSomething(agent=1, label="Wrote a fact", icon="pin", detail="the viewer runs from dist", ref="fact:4"), rows=[AgentRow(n=1)])
                >> Updated(AgentRow(n=1), cards=[{"label": "Wrote a fact", "icon": "pin", "detail": "the viewer runs from dist", "ref": "fact:4"}]),
        ])
