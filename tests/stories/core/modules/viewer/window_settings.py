from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

ZOOM_SAVE = "window save-setting notes.board zoom 2 --environment main"
ZOOM_READ = "window setting notes.board zoom --environment main"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(NOTES, fixture=UserJoined))


def test_a_window_reads_back_the_setting_it_saved(new_story):
    window = window_story(new_story)
    window.story.expect_success(ZOOM_SAVE, actor=window.story.user)
    window.story.expect_success(ZOOM_READ, "key: viewer.window.notes.board.zoom", "value: 2", actor=window.story.user)


def test_a_window_saves_and_reads_its_own_settings_with_no_declaration_or_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("notes.board", "window save-setting notes.board zoom 2")
    window.expect_window_allowed("notes.board", "window setting notes.board zoom")


def test_a_window_is_refused_the_settings_of_another_window(new_story):
    window = window_story(new_story)
    window.expect_window_refusal("notes.board", "window save-setting notes.summary zoom 2", "notes.board may use only its own settings")
    window.expect_window_refusal("notes.board", "window setting notes.summary zoom", "notes.board may use only its own settings")


def test_a_setting_never_saved_is_refused_with_the_way_to_save_one(new_story):
    window = window_story(new_story)
    window.story.expect_refusal(ZOOM_READ, "notes.board has no setting zoom", actor=window.story.user)


def test_a_setting_key_with_a_dot_is_refused_so_it_never_reaches_another_window_s_settings(new_story):
    window = window_story(new_story)
    window.story.expect_refusal("window save-setting notes.board zoom.level 2 --environment main", "a window's setting key has no dot", actor=window.story.user)


def test_a_setting_of_a_window_no_module_declares_is_refused(new_story):
    window = window_story(new_story)
    window.story.expect_refusal("window save-setting notes.calendar zoom 2 --environment main", "no installed module declares the window notes.calendar",
                                actor=window.story.user)
