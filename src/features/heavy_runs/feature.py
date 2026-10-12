from expects import Given, Kept
from features.heavy_runs.details import HeavyRunsDetails
from features.heavy_runs.interceptors import HoldHeavyRunsToOneAtATime
from framework.base import Feature
from framework.journal import Journal
from payload import BashCall
from resources.types import AgentRow

A_TEST_RUN = BashCall.from_payload("Bash", {"command": "pytest tests/test_the_gate.py -q"}, {})
NOT_A_TEST_RUN = BashCall.from_payload("Bash", {"command": "git status"}, {})


class HeavyRuns(Feature):
    details = HeavyRunsDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(HoldHeavyRunsToOneAtATime(), expects=[
            Given(NOT_A_TEST_RUN, rows=[AgentRow(n=1, title="claude-1")]) >> Kept(),
            Given(A_TEST_RUN, rows=[AgentRow(n=1, title="claude-1")]) >> Kept(),
        ])
