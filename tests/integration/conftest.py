from collections.abc import Callable, Generator
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.testing.templates.template_databases import TemplateDatabases
from tests.integration.support.integration_journal import IntegrationJournal
from tests.integration.support.upgraded_journal import UpgradedJournal

MAIN_ENVIRONMENT_LINE = "environment make main /work/journal"


# a journal home with every module synced, on its own copy of the template database: an integration test opens the
# real database and starts the real server here, never through the story kit
@pytest.fixture
def synced_home(templates: TemplateDatabases, tmp_path: Path) -> JournalHome:
    return templates.synced_home(tmp_path / "journal")


@pytest.fixture
def journal(synced_home: JournalHome) -> Generator[IntegrationJournal]:
    opened = IntegrationJournal(synced_home)
    opened.run(MAIN_ENVIRONMENT_LINE, environment_id=None)
    yield opened
    opened.close()


# makes journals synced with the named modules besides the default ones, each on its own copy of a template, with no
# environment yet: journal_with("tests.samples:NotesModule")
@pytest.fixture
def journal_with(templates: TemplateDatabases, tmp_path: Path) -> Generator[Callable[..., IntegrationJournal]]:
    opened: list[IntegrationJournal] = []

    def make(*modules: str) -> IntegrationJournal:
        journal = IntegrationJournal(templates.synced_home(tmp_path / f"journal-{len(opened)}", tuple(modules)))
        opened.append(journal)
        return journal

    yield make
    for journal in opened:
        journal.close()


# a journal with no environment whose home held the version 4 fixture database and was upgraded once
@pytest.fixture
def upgraded(journal_with) -> UpgradedJournal:
    return UpgradedJournal.upgraded(journal_with())
