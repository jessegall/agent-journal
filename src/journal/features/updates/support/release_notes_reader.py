from journal.features.updates.support.release_notes import ReleaseNotes
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.release_messages import ReleaseMessages

RELEASE_MESSAGES_KEY = "updates.release_messages"


class ReleaseNotesReader:
    """The project's unread release messages, and whether this session was already pointed at them."""

    def __init__(self, messages: ReleaseMessages, entries: Entries) -> None:
        self.messages, self.entries = messages, entries

    def read(self, agent: Agent) -> ReleaseNotes:
        unread = self.messages.unread()
        if not unread:
            return ReleaseNotes()
        return ReleaseNotes(len(unread), bool(self.entries.recent_lines(agent.session, RELEASE_MESSAGES_KEY, 0)))
