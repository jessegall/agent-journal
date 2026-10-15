from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages

REMIND_EVERY = 3
PATIENCE = 5
"""Reminders of an unread inbox before the next write waits for it to be read."""


class HoldUnread(AgentListener[ToolStarting]):
    """An unread inbox is named again every third tool use, and after five such reminders the next write waits until it is read."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, messages: Messages, entries: Entries) -> None:
        self.machine, self.nudger, self.messages, self.entries = machine, nudger, messages, entries

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.messages.feature import Messages as MessagesFeature
        unread = self.messages.unread(event.environment_id)
        if not unread:
            return None
        oldest = min(m.created_at for m in unread)
        uses = len([e for e in self.entries.of_kind(event.environment_id, "ToolStarting", 200) if e.actor and e.actor.id == event.session and e.created_at >= oldest])
        if uses // REMIND_EVERY >= PATIENCE and event.writes:
            return Decision.refuse(MessagesFeature.UNREAD_HELD.about(count=len(unread)).rendered())
        if uses % REMIND_EVERY:
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), MessagesFeature.inbox(unread))
        return Decision.tell(line) if line else None
