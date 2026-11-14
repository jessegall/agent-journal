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
        for kind, instance in replacements.items():
            container.bind(kind, instance)
    return setup

@pytest.fixture
def played(templates: TemplateDatabases, tmp_path: Path) -> Generator[Callable[..., FixtureJournal]]:
    opened: list[IntegrationJournal] = []

    # played(Fixture, module, ...), played(module, ...) with no fixture, or, as a story helper calls new_story, played(module, ..., fixture=Fixture)
    def make(*arguments, fixture: type | None = None) -> FixtureJournal:
        leading_fixture = arguments[:1] if arguments and isinstance(arguments[0], type) else ()
        modules = arguments[len(leading_fixture):]
        fixture = fixture if fixture is not None else next(iter(leading_fixture), None)
        home, state = templates.fixture_home(tmp_path / f"played-{len(opened)}", fixture, tuple(modules))
        # what the test binds in place of a part of the outside world reaches every container built from this home
        replacements: dict[type, object] = {}
        home = replace(home, container_setup=bound_in(replacements))
        journal = IntegrationJournal(home)
        opened.append(journal)
        # the fixture's rows were written on the story clock, so the journal goes on from that same moment
        clock = ManualClock()
        journal.with_clock(clock)
        return FixtureJournal(journal, clock, replacements, state.agent, state.user, state.helper)

    yield make
    for journal in opened:
        journal.close()
