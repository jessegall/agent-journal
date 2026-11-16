from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.support.phase_test_runs import PHASE_TESTS_KEY, PhaseTestRuns
from suites.coding.modules.workers.types.worker import Worker


class PhaseTestEffect(EventEffect):
    """Counts each test run a worker starts between two commits, once the run is admitted."""

    key = PHASE_TESTS_KEY
    events = [HookEventName.PRE_TOOL_USE]
    agent_types = [Worker.key]
    timing = EffectTiming.PERMITTED

    def __init__(self, runs: PhaseTestRuns) -> None:
        self.runs = runs

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.runs.answer(event, agent_id).records if event is not None else []
