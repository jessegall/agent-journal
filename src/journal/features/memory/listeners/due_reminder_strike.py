from journal.events.agent.line_delivered import LineDelivered
from journal.events.agent_listener import AgentListener
from journal.repositories.reminders import Reminders
from journal.repositories.scope import Scope
from journal.support.actor import Actor


class DueReminderStrike(AgentListener[LineDelivered]):
    """A reminder set for a moment is struck once the agent has been told it is due, so it is told once."""

    def __init__(self, reminders: Reminders, scope: Scope) -> None:
        self.reminders, self.scope = reminders, scope

    def handle(self, event: LineDelivered) -> None:
        from journal.features.memory.feature import Memory
        if event.nudge != Memory.REMINDER_DUE.key:
            return
        with self.scope.environment(event.environment_id):
            for reminder in self.reminders.matching(id=int(event.values["n"])):
                self.reminders.delete(reminder, Actor.system())
