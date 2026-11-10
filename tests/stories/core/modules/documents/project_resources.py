import pytest

from engine.database.database import Database
from core.base.registry.registry import Registry
from core.base.viewer.window_place import WindowPlace
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from core.testing.line_outcome import LineOutcome
from tests.stories.core.support.coding_fixtures import UserBuilder


class TwoEnvironments(StoryFixture):
    """Two environments in one project, with a user and a coding agent in main."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.run('environment make other /work/other', actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text('environment list', 'other', actor=story.user)


@pytest.mark.parametrize(('creation', 'listing', 'inspection_command', 'text'), [
    ('doc make "Project guide" --abstract "Project rules" --body "Shared instructions"',
     'doc list', 'doc show 1 --all', 'Shared instructions'),
    ('report make "Project guide" --abstract "Project review" --body "Shared findings"',
     'report list', 'report show 1 --all', 'Shared findings'),
    ('sequence make "Project guide" --steps "Read the guide | Check the code"',
     'sequence list', 'sequence show 1', 'Read the guide'),
    ('check make "Project guide" --command "true"',
     'check list', 'check show 1', 'Project guide'),
    ('dump make "Project guide"',
     'dump board', 'dump show 1', 'Project guide'),
])
def test_project_resources_are_read_from_both_environments(new_story, creation, listing, inspection_command, text):
    story = new_story(fixture=TwoEnvironments)
    story.expect_success(f'{creation} --environment main', actor=story.user)
    for environment_id in (1, 2):
        environment_read(story, f'{listing} --json', environment_id).expect_text('Project guide')
        environment_read(story, inspection_command, environment_id).expect_text(text)


def test_documents_have_no_environment_owner(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_success('doc make "Project guide" --abstract "Project rules" --body "Shared" --environment main',
                         actor=story.user)
    environment_read(story, 'doc show 1 --json', 2).expect_no_text('environment_id')


def test_a_document_edited_in_another_environment_changes_the_same_row(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_success('doc make "Project guide" --abstract "Project rules" --body "Original" --environment main',
                         actor=story.user)
    story.expect_success('doc edit 1 --body "Updated in other" --environment other', actor=story.user)
    environment_read(story, 'doc show 1 --all', 1).expect_text('Updated in other')


def test_a_dump_can_be_created_for_the_project_without_choosing_an_environment(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_success('dump make "Project notes"', actor=story.user)
    environment_read(story, 'dump show 1', 2).expect_text('Project notes')


def test_a_dump_closed_in_another_environment_leaves_its_original_dock(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_success('dump make "Project notes" --environment main', actor=story.user)
    story.run_listeners()
    environment_read(story, 'dock-item list --dock 1', 1).expect_text('docked')
    story.expect_success('dump filed 1 1 "Filed from other" --environment other', actor=story.user)
    story.run_listeners()
    environment_read(story, 'dock-item list --dock 1', 1).expect_text('undocked')


def test_dumps_have_no_navigation_item(new_story):
    story = new_story(fixture=TwoEnvironments)
    windows = Registry.read(story.container.get(Database)).windows
    story.expect_rows(all(window.name != 'dumps.dumps' or window.place != WindowPlace.PAGE.value for window in windows))


@pytest.mark.parametrize('name', ['documents.documents', 'sequences.sequences', 'checks.checks'])
def test_project_resources_are_listed_under_project_in_navigation(new_story, name):
    story = new_story(fixture=TwoEnvironments)
    windows = Registry.read(story.container.get(Database)).windows
    story.expect_rows(any(window.name == name and window.group == 'project' for window in windows))


def environment_read(story: Story, line: str, environment_id: int) -> LineOutcome:
    outcome = story.run(line, actor=story.user, environment_id=environment_id)
    outcome.expect_code(0)
    return outcome
