from engine.time.clock import Clock
from engine.command.command import Command
from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees import RemoveOrphanWorktrees


class OrphanWorktreeEffect(EventEffect):
    """On the tick that falls on the first minute of an hour, the worktrees no worker holds are swept away."""

    key = "workers.worktree-sweep"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, clock: Clock) -> None:
        self.clock = clock

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        if self.clock.timestamp().value.minute != 0:
            return []
        return [RemoveOrphanWorktrees()]
