from engine.container.container import Container
from dataclasses import replace
from collections.abc import Callable, Generator
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.testing.templates.template_databases import TemplateDatabases
from engine.testing.fakes.manual_clock import ManualClock
from tests.integration.support.fixture_journal import FixtureJournal
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


# makes journals copied from a story fixture's template, built once and cached as the stories' are, with the agent and
# user the fixture made: played(StartedTaskBuilder), or played(CheckpointPlan, "tests.samples:NotesModule")

# the setup of each container built from a played home: every stand-in the test bound, bound again
def bound_in(replacements: dict[type, object]) -> Callable[[Container], None]:
    def setup(container: Container) -> None:
        for category, instance in replacements.items():
            container.bind(category, instance)
    return setup

@pytest.fixture
def played(templates: TemplateDatabases, tmp_path: Path) -> Generator[Callable[..., FixtureJournal]]:
    opened: list[IntegrationJournal] = []

    def make(*arguments, fixture: type | None = None, environment: str | None = None) -> FixtureJournal:
        # the fixture may come first, last or by name, as the moved stories wrote new_story; every other argument is a module
        modules = tuple(argument for argument in arguments if isinstance(argument, str))
        fixture = fixture if fixture is not None else next((argument for argument in arguments if isinstance(argument, type)), None)
        home, state = templates.fixture_home(tmp_path / f"played-{len(opened)}", fixture, tuple(modules))
        # what the test binds in place of a part of the outside world reaches every container built from this home
        replacements: dict[type, object] = {}
        home = replace(home, container_setup=bound_in(replacements))
        journal = IntegrationJournal(home)
        opened.append(journal)
        # the fixture's rows were written on the story clock, so the journal goes on from that same moment
        clock = ManualClock()
        journal.with_clock(clock)
        return FixtureJournal(journal, clock, replacements, state.agent, state.user, state.helper, environment)

    yield make
    for journal in opened:
        journal.close()
