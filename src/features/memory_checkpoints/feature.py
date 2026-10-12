from controllers.types import Rules
from events.agents import AgentReported
from events.resources import ResourceCreated
from events.agents import AgentChanged
from expects import WHEN, Answered, Given, Held, Nudged, Remembered, Unchanged, Updated
from framework.base import Feature
from features.memory_checkpoints.commands import Reread
from features.memory_checkpoints.details import MemoryCheckpointsDetails
from features.memory_checkpoints.handlers import DecideAtMarks, DecideAtMarksOnChange, MarkWhatWasKept, ReleaseOnceDecided, owed_reading
from framework.sending import Nudge
from framework.journal import Journal
from resources.types import AgentRow, Fact, Rule


class MemoryCheckpoints(Feature):
    details = MemoryCheckpointsDetails
    nudges = (Nudge("reread", behaviour="rereading", about=owed_reading, private=False,
                    guarantee="When the weekly reading of every rule and fact is owed, the agent is told to do it."),)

    def register(self, journal: Journal) -> None:
        journal.commands.add("rule", Reread(), expects=[
            Given((Rules,)) >> Answered("") & Remembered("cleanup_read_at", WHEN),
            Given((Rules,), rows=[Rule(n=3, title="Never merge the refactor", brief="until the user approves"), Fact(n=9, title="The viewer runs from dist")])
                >> Answered("rule 3  Never merge the refactor\nuntil the user approves\n\nfact 9  The viewer runs from dist") & Remembered("cleanup_read_at", WHEN),
        ])
        journal.events.handler(DecideAtMarks(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, data={"context": 60})])
                >> Held("context 60% full — decide before any other write — journal fact, journal rule, or journal nothing \"<why>\"") & Nudged("decide", percent=60),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, data={"context": 60, "decided": 60})]) >> Unchanged(),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, data={"context": 5})]) >> Unchanged(),
        ])
        journal.events.handler(DecideAtMarksOnChange(), expects=[
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, data={"context": 60})])
                >> Held("context 60% full — decide before any other write — journal fact, journal rule, or journal nothing \"<why>\"") & Nudged("decide"),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, data={"context": 60, "decided": 60})]) >> Unchanged(),
            Given(AgentChanged(agent=1, action="created"), rows=[AgentRow(n=1, data={"context": 60})]) >> Unchanged(),
        ])
        journal.events.handler(ReleaseOnceDecided(), expects=[
            Given(ResourceCreated(n=4, type="fact", actor="agent"), rows=[AgentRow(n=1, data={"context": 60}), Fact(n=4, title="a claim")]) >> Unchanged(),
            Given(ResourceCreated(n=4, type="todo", actor="agent"), rows=[AgentRow(n=1, data={"context": 60})]) >> Unchanged(),
        ])
        journal.events.handler(MarkWhatWasKept(), expects=[
            Given(ResourceCreated(n=4, type="fact", actor="agent"), rows=[AgentRow(n=1), Fact(n=4, title="the viewer runs from dist")])
                >> Updated(AgentRow(n=1), cards=[{"label": "Wrote a fact", "icon": "pin", "detail": "the viewer runs from dist", "ref": "fact:4"}]),
            Given(ResourceCreated(n=4, type="fact", actor="user"), rows=[AgentRow(n=1), Fact(n=4, title="the viewer runs from dist")]) >> Unchanged(),
            Given(ResourceCreated(n=4, type="todo", actor="agent"), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
