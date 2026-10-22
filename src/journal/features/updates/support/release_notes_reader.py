from journal.features.updates.support.release_messages import ReleaseMessages
from journal.features.updates.support.release_notes import ReleaseNotes
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.journal_versions import JournalVersions

RELEASE_MESSAGE_KEY = "updates.release_message"


class ReleaseNotesReader:
    """The release messages the last update crossed that this environment has not been told, by the lines already said."""

    def __init__(self, versions: JournalVersions, entries: Entries) -> None:
        self.versions, self.entries = versions, entries

    def read(self, agent: Agent) -> ReleaseNotes:
        current = self.versions.current()
        if current is None:
            return ReleaseNotes()
        release_messages = ReleaseMessages.crossed(current.previous, current.version)
        if not release_messages:
            return ReleaseNotes()
        history = "\n".join(self.entries.key_lines(RELEASE_MESSAGE_KEY))
        return ReleaseNotes(tuple(message for message in release_messages if f"updated to {message.version}:" not in history))
