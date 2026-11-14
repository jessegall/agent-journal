from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.container.container import Container
from engine.enums.actor_type import ActorType
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from tests.integration.support.integration_journal import IntegrationJournal, LineAnswer

MAIN_AGENT_START = "agent start s-1 claude main --environment main"


@dataclass(frozen=True)
class ActedJournal:
    """An integration journal with a main agent and a user, offering the few parts the module sample helpers under
    tests/stories read (container, home, agent, user), so a moved test reuses them as they are."""

    journal: IntegrationJournal
    agent: Actor
    user: Actor

    @staticmethod
    def started(journal: IntegrationJournal) -> "ActedJournal":
        agent = Actor(journal.new_row_id(MAIN_AGENT_START), ActorType.AGENT)
        return ActedJournal(journal, agent, journal.make_user())

    @property
    def container(self) -> Container:
        return self.journal.container

    @property
    def home(self) -> JournalHome:
        return self.journal.home

    def run(self, line: str, actor: Actor | None = None) -> LineAnswer:
        return self.journal.run(line, actor)

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        return self.journal.new_row_id(line, actor)

    def run_listeners(self) -> None:
        self.container.get(CommitListenerRunner).run()
