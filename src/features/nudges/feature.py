from engine.events.engine import ClockTicked
from expects import WHEN, Given, Remembered, Unchanged
from resources.types import AgentRow, Nudge, Todo
from features.base import Feature
from features.journal import Journal
from features.nudges.details import NudgesDetails
from features.nudges.standing import AskAgain, ClearWhenAnswered, NudgeCreated, RowChanged, StandUntilAnswered


class NudgesFeature(Feature):
    details = NudgesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(StandUntilAnswered(), expects=[
            Given(NudgeCreated(n=1), rows=[Nudge(n=1, title="a reminder")]) >> Unchanged(),
            Given(NudgeCreated(n=1), rows=[Nudge(n=1, title="plan 32 stands still", created=WHEN, data={"asks": "plans.standing_still", "until": ["plan.completed"], "rows": ["plan:32"]})])
                >> Remembered("standing", {"1": {"n": 1, "asks": "plans.standing_still", "until": ["plan.completed"], "rows": ["plan:32"], "session": None, "at": WHEN}}),
        ])
        journal.events.handler(ClearWhenAnswered(), expects=[
            Given(RowChanged(n=7, type="todo", action="updated"), rows=[Todo(n=7, title="the header")]) >> Unchanged(),
        ])
        journal.events.handler(AskAgain(), expects=[
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
