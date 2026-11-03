from core.testing.story_fixture import StoryFixture

from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined

SEARCH = "window search questions.questions"


def test_a_window_reads_the_rows_its_declared_search_finds_for_the_words(new_story):
    story = new_story(fixture=DatabaseQuestions)
    story.expect_text(f"{SEARCH} database", "Which database?", actor=story.user)
    story.expect_absent(f"{SEARCH} database", "Which cache?", actor=story.user)


def test_a_search_with_no_words_finds_every_row(new_story):
    story = new_story(fixture=DatabaseQuestions)
    story.expect_text(SEARCH, "Which database?", "Which cache?", actor=story.user)


def test_every_word_must_be_held_by_a_row_found(new_story):
    story = new_story(fixture=DatabaseQuestions)
    story.expect_text(f"{SEARCH} which cache", "Which cache?", actor=story.user)
    story.expect_absent(f"{SEARCH} which cache", "Which database?", actor=story.user)


def test_a_window_may_run_its_own_search_without_declaring_the_line(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("questions.questions", f"{SEARCH} database")


def test_a_window_may_not_run_the_search_of_another_window(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_refusal("questions.questions", "window search suggestions.suggestions cart", "may use only its own search")


def test_a_window_that_declares_no_search_is_refused_one(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("window search questions.waiting cart", "questions.waiting declares no search", actor=story.user)


def test_a_window_nobody_declares_is_refused_a_search(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("window search notes.calendar cart", "no installed module declares the window notes.calendar", actor=story.user)


def test_the_declaration_lists_what_the_viewer_draws_without_the_function(new_story):
    story = new_story(fixture=UserJoined)
    window = next(window for window in Registry.read(story.container.get(Database)).windows if window.name == "questions.questions")
    assert window.search["placeholder"] == "Search the questions"
    assert window.search["context"] == [] and window.search["button"] == {}


class DatabaseQuestions(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.run('question ask "Which database?" --environment main', actor=story.agent)
        story.run('question ask "Which cache?" --environment main', actor=story.agent)
