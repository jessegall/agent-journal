from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_settings_window_is_a_component_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("settings.settings", "component", "environment")


def test_the_settings_window_reads_the_tree_and_sets_and_switches_settings(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("settings.settings", "setting tree")
    window.expect_window_allowed("settings.settings", "setting set journal.core.docking.most-items 4")
    window.expect_window_allowed("settings.settings", "setting switch journal.core.settings.guard on")


def test_the_tree_answers_one_row_per_setting_with_its_value_shown(new_story):
    window = window_story(new_story)
    window.story.expect_text("setting tree --json --environment main", '"key": "journal.core.docking.most-items"', '"shown": "6"', actor=window.story.user)
