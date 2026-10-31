from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

WINDOW = "reviews.reviewer"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_reviewer_window_is_a_component_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window(WINDOW, "component", "environment")


def test_the_reviewer_window_reads_reviews_steps_and_reviewers_with_no_allowance(new_story):
    window = window_story(new_story)
    for line in ("review list", "review show 1", "review-step list --review 1 --oldest", "reviewer list"):
        window.expect_window_allowed(WINDOW, line)


def test_the_reviewer_window_runs_nothing(new_story):
    window_story(new_story).expect_window_refusal(WINDOW, "review abandon 1", "")
