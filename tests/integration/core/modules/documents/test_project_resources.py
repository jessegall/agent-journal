import pytest

from engine.database.database import Database
from engine.registry.registry import Registry
from engine.enums.window_place import WindowPlace
from engine.testing.stories.story_fixture import StoryFixture
from engine.testing.expectations.line_outcome import LineOutcome
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.integration.support.fixture_journal import FixtureJournal


class TwoEnvironments(StoryFixture):
    """Two environments in one project, with a user and a coding agent in main."""

    parent = UserBuilder

    def steps(self, story: FixtureJournal) -> None:
        story.run('environment make other /work/other', actor=story.user)

    def expect(self, story: FixtureJournal) -> None:
        story.expect_text('environment list', 'other', actor=story.user)












def test_dumps_have_no_navigation_item(played):
    story = played(TwoEnvironments)
    windows = Registry.read(story.container.get(Database)).windows
    story.expect_rows(all(window.name != 'dumps.dumps' or window.place != WindowPlace.PAGE.value for window in windows))


@pytest.mark.parametrize('name', ['documents.documents', 'sequences.sequences', 'checks.checks'])
def test_project_resources_are_listed_under_project_in_navigation(played, name):
    story = played(TwoEnvironments)
    windows = Registry.read(story.container.get(Database)).windows
    story.expect_rows(any(window.name == name and window.group == 'project' for window in windows))


def environment_read(story: FixtureJournal, line: str, environment_id: int) -> LineOutcome:
    outcome = story.run(line, actor=story.user, environment_id=environment_id)
    outcome.expect_code(0)
    return outcome
