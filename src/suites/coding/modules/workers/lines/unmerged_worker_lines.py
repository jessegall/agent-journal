from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.support.unmerged_workers import UNMERGED_WORKER_KEY, UnmergedWorkers


class UnmergedWorkerLines(EventLineSource):
    """At its minute step the main agent is told of each worker whose delivered work waits for a merge; from the third
    reminder on the line requires the merge, which holds the agent until it merges or gives a reason."""

    key = UNMERGED_WORKER_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, unmerged: UnmergedWorkers) -> None:
        self.unmerged = unmerged

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return self.unmerged.answer(event, agent_id).nudges
