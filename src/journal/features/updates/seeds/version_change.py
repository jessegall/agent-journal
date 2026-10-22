from journal.features.seed import Seed
from journal.features.updates.support.release_texts import ReleaseTexts
from journal.features.updates.support.session_restart import SessionRestart
from journal.models.journal_version import JournalVersion
from journal.repositories.agents import Agents
from journal.repositories.journal_versions import JournalVersions
from journal.repositories.release_messages import ReleaseMessages
from journal.support.actor import Actor
from journal.version import VERSION
UNRECORDED_VERSION = "4.4.0"


class VersionChange(Seed):
    """At boot, the version the journal runs is kept as the one it started on, and a change from the last keeps a row for each release message it crossed, for the project's next agent to read, with a notice when the change needs the agent's session started again; the first start of a fresh journal tells nothing, while a journal that has had agents and no version kept was updated from before versions were kept, 4.4, and is told as one."""

    def __init__(self, versions: JournalVersions, restart: SessionRestart, agents: Agents, messages: ReleaseMessages) -> None:
        self.versions, self.restart, self.agents, self.messages = versions, restart, agents, messages

    def run(self) -> None:
        last = self.versions.current()
        if last is None:
            self.versions.save(JournalVersion(version=VERSION), Actor.system())
            if self.agents.all_agents():
                self.crossed(UNRECORDED_VERSION)
        elif last.version != VERSION:
            self.versions.save(last.started(VERSION), Actor.system())
            self.crossed(last.version)

    def crossed(self, previous: str) -> None:
        if SessionRestart.is_crossed(previous, VERSION):
            self.restart.notice()
        for message in ReleaseTexts.crossed(previous, VERSION):
            if not self.messages.has_version(message.version):
                self.messages.save(message, Actor.system())
