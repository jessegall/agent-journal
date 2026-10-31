from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

LAYOUT_SAVE = "viewer-layout save --suite notes --page home --layout '{\"root\": \"pane-1\"}' --environment main"
SECOND_LAYOUT_SAVE = "viewer-layout save --suite notes --page home --layout '{\"root\": \"pane-2\"}' --environment main"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(NOTES, fixture=UserJoined))


def test_a_person_saving_the_same_page_twice_keeps_one_layout_row_holding_the_last(new_story):
    window = window_story(new_story)
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_success(SECOND_LAYOUT_SAVE, 'layout: {"root": "pane-2"}', actor=window.story.user)
    window.expect_row_count("viewer_layouts", 1)


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


def test_a_person_reads_back_the_layout_they_saved_for_a_suite_page_and_driver(new_story):
    window = window_story(new_story)
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_success("viewer-layout current --suite notes --page home --environment main", 'layout: {"root": "pane-1"}', actor=window.story.user)
    window.story.expect_refusal("viewer-layout current --suite notes --page agent --environment main", "you saved no layout of agent for notes", actor=window.story.user)


def test_another_person_reads_none_of_your_layouts(new_story):
    window = window_story(new_story)
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_refusal("viewer-layout current --suite notes --page home --environment main", "you saved no layout", actor=window.new_person("Bob"))


def test_a_save_from_a_layout_loaded_at_an_older_version_is_refused_naming_the_newer_one(new_story):
    window = window_story(new_story)
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_success(f"{SECOND_LAYOUT_SAVE} --base-version 1", "version: 2", actor=window.story.user)
    window.story.expect_refusal(f"{LAYOUT_SAVE} --base-version 1", "the layout was saved again since version 1; it is at version 2", actor=window.story.user)


def test_a_phone_keeps_its_layout_apart_from_the_computers_home_page(new_story):
    window = window_story(new_story)
    window.story.expect_success(LAYOUT_SAVE, actor=window.story.user)
    window.story.expect_success("viewer-layout save --suite notes --page phone --layout '{\"root\": \"pane-9\"}' --environment main", actor=window.story.user)
    window.expect_row_count("viewer_layouts", 2)
    window.story.expect_success("viewer-layout current --suite notes --page home --environment main", 'layout: {"root": "pane-1"}', actor=window.story.user)
    window.story.expect_success("viewer-layout current --suite notes --page phone --environment main", 'layout: {"root": "pane-9"}', actor=window.story.user)
