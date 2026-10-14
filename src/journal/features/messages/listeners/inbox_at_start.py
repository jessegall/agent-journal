from journal.events.agent.session_started import SessionStarted
from journal.features.messages.listeners.tell_inbox import TellInbox


class InboxAtStart(TellInbox[SessionStarted]):
    pass
