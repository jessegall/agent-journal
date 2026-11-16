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
        agent = journal.agent_actor(journal.new_row_id(MAIN_AGENT_START))
        return ActedJournal(journal, agent, journal.make_user())

    @property
    def container(self) -> Container:
        return self.journal.container

    @property
    def home(self) -> JournalHome:
        return self.journal.home

    # a step a module offers for a part of the world no command makes, such as a run printing its output
    def step(self, name: str, *arguments: object) -> object:
        return self.journal.step(name, *arguments)

    def run(self, line: str, actor: Actor | None = None) -> LineAnswer:
        return self.journal.run(line, actor)

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        return self.journal.new_row_id(line, actor)

    def run_listeners(self) -> None:
        self.container.get(CommitListenerRunner).run()

    def expect_success(self, line: str, *texts: str, actor: Actor | None = None) -> LineAnswer:
        answer = self.run(line, actor)
        assert answer.code == 0 and all(text in answer.text for text in texts), (line, answer)
        return answer

    def expect_text(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        assert all(text in answer.text for text in texts), (line, answer)

    def expect_absent(self, line: str, text: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        assert text not in answer.text, (line, answer)

    def expect_refusal(self, line: str, text: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        assert answer.code != 0 and text in answer.text, (line, answer)
