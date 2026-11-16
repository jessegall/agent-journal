from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.support.unmerged_workers import UNMERGED_WORKER_KEY, UnmergedWorkers


class UnmergedWorkerEffect(EventEffect):
    """Closes the main agent's merge holds of workers whose work no longer waits for a merge."""

    key = UNMERGED_WORKER_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, unmerged: UnmergedWorkers) -> None:
        self.unmerged = unmerged

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.unmerged.answer(event, agent_id).stale
