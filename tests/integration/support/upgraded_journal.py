from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from install.version_four.upgrade_journal import UpgradeJournal
from tests.integration.support.integration_journal import IntegrationJournal
from tests.stories.fixtures.version_four import version_four_fixture


@dataclass(frozen=True)
class UpgradedLine:
    """What one line printed on an upgraded journal, checked the way a moved upgrade story checks it."""

    code: int
    output_text: str

    def expect_text(self, *texts: str) -> None:
        assert all(text in self.output_text for text in texts), self.output_text

    def expect_no_text(self, text: str) -> None:
        assert text not in self.output_text, self.output_text


@dataclass(frozen=True)
class UpgradedJournal:
    """An integration journal with no environment whose home held the version 4 fixture database and was upgraded
    once; it offers the calls the version 4 upgrade stories made, so a moved story keeps its body."""

    journal: IntegrationJournal
    upgrade_text: str

    @staticmethod
    def upgraded(journal: IntegrationJournal, prepare=None) -> "UpgradedJournal":
        version_four_fixture(journal.home.folder / "journal.db")
        if prepare:
            prepare(journal.home.folder)
        outcome = UpgradeJournal(journal.home).run(confirmed=True)
        assert outcome.code == 0, outcome.text
        return UpgradedJournal(journal, outcome.text)

    @property
    def home(self) -> JournalHome:
        return self.journal.home

    @property
    def container(self) -> Container:
        return self.journal.container

    @property
    def user(self) -> Actor:
        return Actor.core()

    @property
    def agent(self) -> Actor:
        return Actor.core()

    def run(self, line: str, actor: Actor | None = None) -> UpgradedLine:
        answer = self.journal.run(line, actor)
        return UpgradedLine(answer.code, answer.text)

    def expect_success(self, line: str, *texts: str, actor: Actor | None = None) -> UpgradedLine:
        answer = self.run(line, actor)
        assert answer.code == 0 and all(text in answer.output_text for text in texts), (line, answer)
        return answer

    def expect_text(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        self.run(line, actor).expect_text(*texts)

    def expect_absent(self, line: str, text: str, actor: Actor | None = None) -> None:
        self.run(line, actor).expect_no_text(text)

    def expect_refusal(self, line: str, text: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        assert answer.code != 0 and text in answer.output_text, (line, answer)

    def expect_rows(self, *conditions: bool, detail: str = "") -> None:
        assert all(conditions), detail

    def expect_ordered_lines(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        places = [answer.output_text.find(text) for text in texts]
        assert answer.code == 0 and -1 not in places and places == sorted(places), (line, texts, answer)
