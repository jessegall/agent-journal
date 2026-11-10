from engine.scope.scopes import Scopes
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.setting.setting_values import SettingValues
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.scope.environment_rows import TwoWorkingEnvironments, staging_agent

BATCH_SIZE = "journal.core.processes.run-batch-size"


class ProjectAndStagingValues(StoryFixture):
    """The run batch size is 3 for the project and 7 in environment staging."""

    parent = TwoWorkingEnvironments

    def steps(self, story):
        story.run(f"setting set {BATCH_SIZE} 3 --project", actor=story.user)
        story.run(f"setting set {BATCH_SIZE} 7 --environment staging", actor=story.user)

    def expect(self, story):
        story.expect_text(f"setting show {BATCH_SIZE} --environment staging", "value: 7", actor=story.user)


def test_a_setting_read_takes_the_environment_of_the_scope(new_story):
    story = new_story(fixture=ProjectAndStagingValues)
    with story.container.get(Scopes).read_scope((), None, 2):
        story.expect_rows(story.container.get(SettingValues).number(BATCH_SIZE) == 7)


def test_a_setting_read_in_another_environment_gets_the_project_value(new_story):
    story = new_story(fixture=ProjectAndStagingValues)
    with story.container.get(Scopes).read_scope((), None, 1):
        story.expect_rows(story.container.get(SettingValues).number(BATCH_SIZE) == 3)


def test_a_setting_read_with_no_scope_gets_the_project_value(new_story):
    story = new_story(fixture=ProjectAndStagingValues)
    story.expect_rows(story.container.get(SettingValues).number(BATCH_SIZE) == 3)


def test_the_project_value_holds_in_any_scope(new_story):
    story = new_story(fixture=ProjectAndStagingValues)
    with story.container.get(Scopes).read_scope((), None, 2):
        story.expect_rows(story.container.get(SettingValues).project_value(BATCH_SIZE) == 3)


def test_an_agent_reads_the_setting_of_its_environment(new_story):
    story = new_story(fixture=ProjectAndStagingValues)
    story.expect_text(f"setting show {BATCH_SIZE}", "value: 7", actor=staging_agent(story))
    story.expect_text(f"setting show {BATCH_SIZE}", "value: 3", actor=story.agent)


def test_a_person_s_request_reads_the_setting_of_the_environment_it_names(new_story):
    story = new_story(fixture=ProjectAndStagingValues)
    story.expect_text(f"setting show {BATCH_SIZE} --environment staging", "value: 7", actor=story.user)


def test_the_suite_choice_reads_the_suite_of_the_scope(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    with story.container.get(Scopes).read_scope((), None, 2):
        story.expect_rows(story.container.get(SuiteChoice).suite().name == "coding")
