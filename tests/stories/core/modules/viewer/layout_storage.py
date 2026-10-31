from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

LAYOUT_SAVE = "viewer-layout save --suite notes --page home --layout '{\"root\": \"pane-1\"}'"
SECOND_LAYOUT_SAVE = "viewer-layout save --suite notes --page home --layout '{\"root\": \"pane-2\"}'"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(NOTES, fixture=UserJoined))


def test_a_person_saving_the_same_page_twice_keeps_one_layout_row_holding_the_last(new_story):
    window = window_story(new_story)
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_success(SECOND_LAYOUT_SAVE, actor=window.story.user)
    window.expect_row_count("viewer_layouts", 1)
    window.story.expect_success("viewer-layout list", 'layout: {"root": "pane-2"}', actor=window.story.user)


def test_two_people_keep_their_own_layout_of_the_same_page(new_story):
    window = window_story(new_story)
    bob = window.new_person("Bob")
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_success(SECOND_LAYOUT_SAVE, actor=bob)
    window.expect_row_count("viewer_layouts", 2)


def test_a_layout_is_kept_apart_per_driver(new_story):
    window = window_story(new_story)
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_success(f"{SECOND_LAYOUT_SAVE} --driver coding.orchestrator", actor=window.story.user)
    window.expect_row_count("viewer_layouts", 2)


def test_an_agent_cannot_save_a_layout(new_story):
    window = window_story(new_story)
    window.story.expect_refusal(LAYOUT_SAVE, "only a person keeps a layout", actor=window.story.agent)
