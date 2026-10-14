from journal.events.agent.idle import Idle
from journal.features.messages.listeners.tell_inbox import TellInbox


class InboxAtStop(TellInbox[Idle]):
    pass
