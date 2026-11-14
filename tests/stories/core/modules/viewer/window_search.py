from engine.testing.stories.story_fixture import StoryFixture

from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row

SEARCH = "window search questions.questions"


def test_a_search_with_no_words_finds_every_row(new_story):
    story = new_story(fixture=DatabaseQuestions)
    story.expect_text(SEARCH, "Which database?", "Which cache?", actor=story.user)


def test_a_window_may_run_its_own_search_without_declaring_the_line(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("questions.questions", f"{SEARCH} database")


def test_a_window_may_not_run_the_search_of_another_window(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_refusal("questions.questions", "window search suggestions.suggestions cart", "may use only its own search")


def test_a_window_nobody_declares_is_refused_a_search(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("window search notes.calendar cart", "no installed module declares the window notes.calendar", actor=story.user)


class DatabaseQuestions(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
        story.run('question ask "Which cache?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)


def expect_fields_search(search, expected) -> None:
    actual = search['fields']
    assert actual == expected, actual


def expect_reads_windows_with(windows, name, expected) -> None:
    actual = windows[name].reads
    assert expected in actual, actual
