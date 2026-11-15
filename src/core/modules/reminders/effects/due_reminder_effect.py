from collections.abc import Sequence
from typing import TYPE_CHECKING

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.command.command import Command
from engine.enums.agent_role import AgentRole
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired import RecordReminderFired
from core.modules.reminders.rules.due_reminder_rule import DueReminderRule
from core.modules.reminders.support.due_reminders import DueReminders

if TYPE_CHECKING:
    from engine.agent_machine.decision_record import DecisionRecord


class DueReminderEffect(Effect):
    """Each reminder the main agent is told of is recorded as fired, so it comes again only at its next time."""

    events = [event for event in HookEventName if event is not HookEventName.TICK]
    includes_steps = True
    agent_types = [AgentRole.MAIN.value]
    replaced_rules = tuple([DueReminderRule.name])
    timing = EffectTiming.UNCONDITIONAL

    def __init__(self, reminders: DueReminders, clock: Clock) -> None:
        self.reminders, self.clock = reminders, clock

    def commands(self, view: AgentView, record: "DecisionRecord") -> Sequence[Command[object]]:
        return [RecordReminderFired(reminder.id) for reminder in self.reminders.due(view.agent.agent_id, self.clock.timestamp())]
