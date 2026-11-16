from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_category import LineCategory
from engine.time.clock import Clock
from core.modules.reminders.agent_messages.reminder_line_message import ReminderLineMessage
from core.modules.reminders.support.due_reminders import DUE_REMINDER_KEY, DueReminders


class DueReminderLines(LineSource):
    """The main agent is told each reminder that has come due, on any event and at its minute step."""

    events = [event for event in HookEventName if event is not HookEventName.TICK]
    includes_steps = True
    agent_types = [AgentRole.MAIN.value]
    key = DUE_REMINDER_KEY
    category = LineCategory.STEERING

    def __init__(self, reminders: DueReminders, clock: Clock) -> None:
        self.reminders, self.clock = reminders, clock

    def lines(self, question: Question, view: AgentView) -> Sequence[Line]:
        agent_messages = [ReminderLineMessage.declared().agent_message(reminder=reminder.id) for reminder in self.reminders.due(view.agent.agent_id, self.clock.timestamp())]
        return [Line.agent_message_line(agent_message, self.channel, self.category) for agent_message in agent_messages]
