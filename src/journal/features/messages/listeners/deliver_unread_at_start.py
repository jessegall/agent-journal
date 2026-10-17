from journal.events.agent.session_started import SessionStarted
from journal.features.messages.listeners.tell_inbox import TellInbox


class DeliverUnreadAtStart(TellInbox[SessionStarted]):
    """A session starting is caught up on what waits unread, by number: delivery, since the agent may have missed the line typed when the message came."""
