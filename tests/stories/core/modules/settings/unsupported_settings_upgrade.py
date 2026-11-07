from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.settings.support.unsupported_settings_report import expect_unsupported_settings_report
from tests.stories.fixtures.unsupported_settings import prepare_unsupported_settings


def test_each_removed_project_setting_is_reported_with_its_value_and_reason(new_story):
    story = upgraded_story(new_story, prepare=prepare_unsupported_settings)
    expect_unsupported_settings_report(story)
