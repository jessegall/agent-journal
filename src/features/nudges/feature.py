from events.agents import ClockTicked
from expects import WHEN, Dispatches, Given, Remembered, Updated, Wrote, nothing
from resources.types import AgentRow, Nudge, Todo
from framework.base import Feature
from framework.journal import Journal
from features.nudges.details import NudgesDetails
from features.nudges.handlers import AskAgain, ClearWhenAnswered, ForgetNudge, KeepNudgeStanding, LetGoOfLostNudges
from features.nudges.listeners import SpotNudgeThatStands, SpotRowThatAnswers, SpotStandingNudgesToAsk
from events.nudges import NudgeAsksToAct, NudgeDueAgain, StandingNudgeAnswered, StandingNudgeGone, StandingNudgesLost
from events.nudges import NudgeCreated
from events.resources import RowChanged


ON_TODO_7 = {"1": {"n": 1, "asks": "todos.unfinished", "until": ["todo.completed"], "rows": ["todo:7"], "session": None, "at": WHEN}}
STANDING_ON_PLAN_32 = Nudge(n=1, title="plan 32 stands still", created=WHEN, data={"asks": "plans.standing_still", "until": ["plan.completed"], "rows": ["plan:32"]})
STANDING_ON_TODO_7 = Nudge(n=1, title="todo 7 is unfinished", data={"asks": "todos.unfinished", "until": ["todo.completed"], "rows": ["todo:7"]})


class NudgesFeature(Feature):
    details = NudgesDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(NudgeCreated, SpotNudgeThatStands(), expects=[
            Given(NudgeCreated(n=1), rows=[Nudge(n=1, title="a reminder")]) >> Dispatches(nothing),
            Given(NudgeCreated(n=1), rows=[STANDING_ON_PLAN_32]) >> Dispatches(NudgeAsksToAct(nudge=1)),
        ])
        journal.events.handle(NudgeAsksToAct, KeepNudgeStanding(), expects=[
            Given(NudgeAsksToAct(nudge=1), rows=[STANDING_ON_PLAN_32])
                >> Remembered("standing", {"1": {"n": 1, "asks": "plans.standing_still", "until": ["plan.completed"], "rows": ["plan:32"], "session": None, "at": WHEN}}),
        ])
        journal.events.listen(RowChanged, SpotRowThatAnswers(), expects=[
            Given(RowChanged(n=7, type="todo", action="updated"), rows=[Todo(n=7, title="the header")]) >> Dispatches(nothing),
            Given(RowChanged(n=7, type="todo", action="completed"), rows=[Todo(n=7, title="the header"), STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7})
                >> Dispatches(StandingNudgeAnswered(type="todo", n=7, action="completed")),
            Given(RowChanged(n=8, type="todo", action="completed"), rows=[Todo(n=8, title="the footer"), STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7})
                >> Dispatches(nothing),
            Given(RowChanged(n=1, type="nudge", action="completed"), rows=[STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7}) >> Dispatches(StandingNudgeGone(nudge=1)),
            Given(RowChanged(n=1, type="nudge", action="updated"), rows=[STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7}) >> Dispatches(nothing),
        ])
        journal.events.handle(StandingNudgeAnswered, ClearWhenAnswered(), expects=[
            Given(StandingNudgeAnswered(type="todo", n=7, action="completed"), rows=[Todo(n=7, title="the header"), STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7})
                >> Updated(Nudge(n=1), outcome="answered by todo 7, completed") & Remembered("standing", {}),
            Given(StandingNudgeAnswered(type="todo", n=7, action="completed"), rows=[Todo(n=7, title="the header"), STANDING_ON_TODO_7],
                  remembered={"nudges.standing": {"1": {**ON_TODO_7["1"], "rows": ["todo:7", "todo:8"]}}})
                >> Remembered("standing", {"1": {**ON_TODO_7["1"], "rows": ["todo:8"]}}),
        ])
        journal.events.handle(StandingNudgeGone, ForgetNudge(), expects=[
            Given(StandingNudgeGone(nudge=1), rows=[STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7}) >> Remembered("standing", {}),
        ])
        journal.events.listen(ClockTicked, SpotStandingNudgesToAsk(), expects=[
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "idle"}), STANDING_ON_TODO_7],
                  remembered={"nudges.standing": {"1": {**ON_TODO_7["1"], "session": "claude-0"}}})
                >> Dispatches(StandingNudgesLost(elsewhere=(1,), gone=(), kept=())),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "idle"}), STANDING_ON_TODO_7],
                  remembered={"nudges.standing": {"1": {**ON_TODO_7["1"], "session": "claude-1"}}})
                >> Dispatches(StandingNudgesLost(elsewhere=(), gone=(1,), kept=())),
        ])
        journal.events.handle(StandingNudgesLost, LetGoOfLostNudges(), expects=[
            Given(StandingNudgesLost(elsewhere=(1,), gone=(), kept=()), rows=[STANDING_ON_TODO_7], remembered={"nudges.standing": {"1": {**ON_TODO_7["1"], "session": "claude-0"}}})
                >> Updated(Nudge(n=1), outcome="said to a session that is no longer the agent's") & Remembered("standing", {}),
            Given(StandingNudgesLost(elsewhere=(), gone=(1,), kept=()), rows=[STANDING_ON_TODO_7], remembered={"nudges.standing": {"1": {**ON_TODO_7["1"], "session": "claude-1"}}})
                >> Updated(Nudge(n=1), outcome="what it asked about is gone") & Remembered("standing", {}),
            Given(StandingNudgesLost(elsewhere=(), gone=(), kept=(1,)), rows=[STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7}) >> Remembered("standing", ON_TODO_7),
        ])
        journal.events.handle(NudgeDueAgain, AskAgain(), expects=[
            Given(NudgeDueAgain(nudge=1), rows=[STANDING_ON_TODO_7], remembered={"nudges.standing": ON_TODO_7}) >> Wrote(Nudge(title="todo 7 is unfinished")),
        ])
