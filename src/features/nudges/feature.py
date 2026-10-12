from events.agents import ClockTicked
from expects import WHEN, Given, Remembered, Unchanged, Updated
from resources.types import AgentRow, Nudge, Todo
from features.base import Feature
from features.journal import Journal
from features.nudges.details import NudgesDetails
from features.nudges.standing import AskAgain, ClearWhenAnswered, StandUntilAnswered
from events.nudges import NudgeCreated
from events.resources import RowChanged


ON_TODO_7 = {"1": {"n": 1, "asks": "todos.unfinished", "until": ["todo.completed"], "rows": ["todo:7"], "session": None, "at": WHEN}}
STANDING_ON_TODO_7 = Nudge(n=1, title="todo 7 is unfinished", data={"asks": "todos.unfinished", "until": ["todo.completed"], "rows": ["todo:7"]})


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
            Given(RowChanged(n=7, type="todo", action="completed"), rows=[Todo(n=7, title="the header"), STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7})
                >> Updated(Nudge(n=1), outcome="answered by todo 7, completed") & Remembered("standing", {}),
            Given(RowChanged(n=8, type="todo", action="completed"), rows=[Todo(n=8, title="the footer"), STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7})
                >> Unchanged() & Remembered("standing", ON_TODO_7),
        ])
        journal.events.handler(AskAgain(), expects=[
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "idle"}), STANDING_ON_TODO_7], remembered={"nudges.standing": {"1": {**ON_TODO_7["1"], "session": "claude-0"}}})
                >> Updated(Nudge(n=1), outcome="said to a session that is no longer the agent's") & Remembered("standing", {}),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "idle"}), STANDING_ON_TODO_7], remembered={"nudges.standing": {"1": {**ON_TODO_7["1"], "session": "claude-1"}}})
                >> Updated(Nudge(n=1), outcome="what it asked about is gone") & Remembered("standing", {}),
        ])
