from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.triggers.commands.fire_trigger.fire_trigger import FireTrigger
from core.modules.triggers.lines.scheduled_trigger_lines import SCHEDULED_TRIGGER_KEY
from core.modules.triggers.support.due_triggers import DueTriggers


class ScheduledTriggerEffect(EventEffect):
    """Each scheduled trigger the main agent was given moves on to its next time or ends."""

    key = SCHEDULED_TRIGGER_KEY
    events = list(HookEventName)
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, due: DueTriggers) -> None:
        self.due = due

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [FireTrigger(trigger.id) for trigger in self.due.due(event, agent_id)]
