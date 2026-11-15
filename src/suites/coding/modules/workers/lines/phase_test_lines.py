from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.support.phase_test_runs import PHASE_TESTS_KEY, PhaseTestRuns
from suites.coding.modules.workers.types.worker import Worker


class PhaseTestLines(EventLineSource):
    """Tells a worker how many test runs it has left before its next commit, at each run it starts."""

    key = PHASE_TESTS_KEY
    events = [HookEventName.PRE_TOOL_USE]
    agent_types = [Worker.key]

    def __init__(self, runs: PhaseTestRuns) -> None:
        self.runs = runs

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return self.runs.answer(event, agent_id).agent_messages if event is not None else []
