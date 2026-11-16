from engine.scope.scopes import Scopes
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.setting.setting_values import SettingValues
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.scope.environment_rows import TwoWorkingEnvironments, staging_agent
from core.modules.processes.models.enums.process_setting import ProcessSetting

LONG_CAPACITY = f"{ProcessSetting.POOL_CAPACITY_LONG.key}"


class ProjectAndStagingValues(StoryFixture):
    """The long lane capacity is 3 for the project and 7 in environment staging."""

    parent = TwoWorkingEnvironments

    def steps(self, story):
        story.run(f"setting set {LONG_CAPACITY} 3 --project", actor=story.user)
        story.run(f"setting set {LONG_CAPACITY} 7 --environment staging", actor=story.user)

    def expect(self, story):
        story.expect_text(f"setting show {LONG_CAPACITY} --environment staging", "value: 7", actor=story.user)


def test_a_setting_read_takes_the_environment_of_the_scope(played):
    story = played(ProjectAndStagingValues)
    with story.container.get(Scopes).read_scope((), None, 2):
        story.expect_rows(story.container.get(SettingValues).number(LONG_CAPACITY) == 7)


def test_a_setting_read_in_another_environment_gets_the_project_value(played):
    story = played(ProjectAndStagingValues)
    with story.container.get(Scopes).read_scope((), None, 1):
        story.expect_rows(story.container.get(SettingValues).number(LONG_CAPACITY) == 3)


def test_a_setting_read_with_no_scope_gets_the_project_value(played):
    story = played(ProjectAndStagingValues)
    story.expect_rows(story.container.get(SettingValues).number(LONG_CAPACITY) == 3)


def test_the_project_value_holds_in_any_scope(played):
    story = played(ProjectAndStagingValues)
    with story.container.get(Scopes).read_scope((), None, 2):
        story.expect_rows(story.container.get(SettingValues).project_value(LONG_CAPACITY) == 3)






def test_the_suite_choice_reads_the_suite_of_the_scope(played):
    story = played(TwoWorkingEnvironments)
    with story.container.get(Scopes).read_scope((), None, 2):
        story.expect_rows(story.container.get(SuiteChoice).suite().name == "coding")
