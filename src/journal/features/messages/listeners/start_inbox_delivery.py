from journal.events.agent.session_started import SessionStarted
from journal.features.messages.listeners.inbox_notice import InboxNotice


class StartInboxDelivery(InboxNotice[SessionStarted]):
    """A session starting is caught up on what waits unread, by number: delivery, since the agent may have missed the line typed when the message came."""
