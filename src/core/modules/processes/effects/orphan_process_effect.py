from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.lines.orphan_process_lines import ORPHAN_PROCESS_KEY
from core.modules.processes.support.orphan_check import OrphanCheck


class OrphanProcessEffect(EventEffect):
    """Ends each run of the agent found lost, or ended in its folder while the server never heard of it."""

    key = ORPHAN_PROCESS_KEY
    events = [HookEventName.TICK]

    def __init__(self, check: OrphanCheck) -> None:
        self.check = check

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.check.orphaned(event, agent_id).commands
