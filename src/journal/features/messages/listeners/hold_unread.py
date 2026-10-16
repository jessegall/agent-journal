from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.settings import PROJECT, Settings


class HoldUnread(AgentListener[ToolStarting]):
    """An unread inbox is named again every third tool use, and after five such reminders the next write waits until it is read."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, messages: Messages, entries: Entries, settings: Settings) -> None:
        self.machine, self.nudger, self.messages, self.entries, self.settings = machine, nudger, messages, entries, settings

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.messages.feature import Messages as MessagesFeature
        unread = self.messages.unread(event.environment_id)
        if not unread:
            return None
        oldest = min(m.created_at for m in unread)
        uses = len([e for e in self.entries.of_kind(event.environment_id, "ToolStarting", 200) if e.actor and e.actor.id == event.session and e.created_at >= oldest])
        every, patience = int(self.settings.option(PROJECT, MessagesFeature.REMIND_EVERY)), int(self.settings.option(PROJECT, MessagesFeature.HOLD_AFTER_REMINDERS))
        if uses // every >= patience and event.writes:
            return Decision.refuse(MessagesFeature.UNREAD_HELD.about(count=len(unread)).rendered())
        if uses % every:
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), MessagesFeature.inbox(unread))
        return Decision.tell(line) if line else None
