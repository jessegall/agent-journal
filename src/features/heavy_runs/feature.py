from events.agents import ToolCallAnswered
from expects.calls import shell_asked
from events.answers import Allowed
from events.asking import ToolCallAsked
from events.heavy_runs import HeavyRunHeld, HeavyRunStarted
from expects import WHEN, Answered, Dispatches, Given, Nudged, nothing
from features.heavy_runs.answering import HoldHeavyRunsToOneAtATime
from features.heavy_runs.details import HeavyRunsDetails
from features.heavy_runs.handlers import LeaveTheQueue, QueueTheHeavyRun
from features.heavy_runs.listeners import SpotHeavyRun
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow

AGENT_ROW = AgentRow(n=1, title="claude-1")
A_TEST_RUN = "pytest tests/test_the_gate.py -q"
NOT_A_TEST_RUN = "git status"



def answered(command: str) -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool="Bash", command=command)


class HeavyRuns(Feature):
    details = HeavyRunsDetails

    def register(self, journal: Journal) -> None:
        journal.events.answer(ToolCallAsked, HoldHeavyRunsToOneAtATime(), expects=[
            Given(shell_asked(NOT_A_TEST_RUN), rows=[AGENT_ROW]) >> Answered(Allowed()),
            Given(shell_asked(A_TEST_RUN), rows=[AGENT_ROW]) >> Answered(Allowed()),
        ])
        journal.events.listen(ToolCallAnswered, SpotHeavyRun(), expects=[
            Given(answered(NOT_A_TEST_RUN), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(answered(A_TEST_RUN), rows=[AGENT_ROW]) >> Dispatches(HeavyRunStarted(agent=1)),
        ])
        journal.events.handle(HeavyRunHeld, QueueTheHeavyRun(), expects=[
            Given(HeavyRunHeld(agent=1, command=A_TEST_RUN, ahead="pytest tests/test_it_boots.py", where="main", at=WHEN), rows=[AGENT_ROW])
                >> Nudged("waiting", command=A_TEST_RUN, ahead="pytest tests/test_it_boots.py", where="main", place="number 1 of 1"),
        ])
        journal.events.handle(HeavyRunStarted, LeaveTheQueue(), expects=[
            Given(HeavyRunStarted(agent=1), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
