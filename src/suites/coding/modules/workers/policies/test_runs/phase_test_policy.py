from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from suites.coding.modules.workers.support.phase_test_runs import PHASE_TESTS_KEY, PhaseTestRuns
from suites.coding.modules.workers.types.worker import Worker


class PhaseTestPolicy(EventPolicy):
    """A worker's test run is refused once its allowance between two commits is spent."""

    key = PHASE_TESTS_KEY
    rank = "workers.policies"
    agent_types = [Worker.key]

    def __init__(self, runs: PhaseTestRuns) -> None:
        self.runs = runs

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        return self.runs.answer(event, agent_id).refusal
