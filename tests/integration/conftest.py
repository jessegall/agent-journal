from collections.abc import Generator
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.testing.templates.template_databases import TemplateDatabases
from tests.integration.support.integration_journal import IntegrationJournal

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
