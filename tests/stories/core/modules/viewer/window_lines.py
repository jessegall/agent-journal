from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(NOTES, fixture=UserJoined))


def test_the_shipped_shell_window_reads_a_line_it_declares_with_no_allowance(new_story):
    window_story(new_story).expect_window_allowed("viewer.shell", "environment list")


def test_a_window_is_refused_a_line_it_does_not_declare(new_story):
    window_story(new_story).expect_window_refusal("viewer.shell", "task list", "viewer.shell does not declare task list")


def test_a_window_is_refused_a_line_that_skips_a_guard(new_story):
    window_story(new_story).expect_window_refusal("notes.board", "task start 1 --skip-guard tasks.dependencies-closed", "may not skip a guard")


def test_a_window_is_refused_a_line_that_skips_a_guard_by_its_short_flag(new_story):
    window_story(new_story).expect_window_refusal("notes.board", "task start 1 --anyway", "may not skip a guard")


def test_a_window_is_refused_a_line_that_names_another_environment(new_story):
    window_story(new_story).expect_window_refusal("notes.board", "task start 1 --environment staging", "name another environment")


def test_a_window_the_journal_does_not_ship_is_refused_a_line_the_person_has_not_allowed(new_story):
    window_story(new_story).expect_window_refusal("notes.board", "task list", "notes.board may run task list once you allow it")


def test_a_window_no_module_declares_is_refused(new_story):
    window_story(new_story).expect_window_refusal("notes.calendar", "task list", "no installed module declares the window notes.calendar")
