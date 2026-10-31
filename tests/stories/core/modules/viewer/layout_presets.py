from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

SHAPE = "'{\"windows\": [\"notes.board\"], \"active\": \"notes.board\"}'"
SAVE = f"person-preset save --page home --name Mine --shape {SHAPE} --environment main"


def window_story(new_story) -> WindowStory:
    story = WindowStory(new_story(NOTES, fixture=UserJoined))
    story.story.run("suite choose notes --environment main")
    return story


def test_the_suites_presets_of_a_page_are_listed_in_the_order_it_declares(new_story):
    window = window_story(new_story)
    window.story.expect_ordered_lines("suite presets main home", "board  Board  The notes board alone", "both  Both  Board and summary")


def test_a_page_the_suite_gives_no_presets_lists_none(new_story):
    window = window_story(new_story)
    window.story.expect_success("suite presets main agent", "nothing found")


def test_a_person_saves_a_layout_of_their_own_and_finds_it_listed(new_story):
    window = window_story(new_story)
    key = window.story.new_row_id(SAVE, actor=window.story.user)
    window.story.expect_text("person-preset list --page home --environment main", f"{key}  ", "home  Mine", actor=window.story.user)


def test_a_person_renames_and_removes_a_saved_layout(new_story):
    window = window_story(new_story)
    key = window.story.new_row_id(SAVE, actor=window.story.user)
    window.story.expect_success(f"person-preset rename {key} --name Review", "name: Review", actor=window.story.user)
    window.story.expect_success(f"person-preset remove {key}", actor=window.story.user)
    window.story.expect_success("person-preset list --page home --environment main", "nothing found", actor=window.story.user)


def test_another_person_lists_none_of_your_saved_layouts(new_story):
    window = window_story(new_story)
    window.story.new_row_id(SAVE, actor=window.story.user)
    window.story.expect_success("person-preset list --page home --environment main", "nothing found", actor=window.new_person("Bob"))


def test_an_agent_cannot_save_a_person_preset(new_story):
    window = window_story(new_story)
    window.story.expect_refusal(SAVE, "only a person keeps a layout", actor=window.story.agent)


def test_another_person_cannot_remove_your_person_preset(new_story):
    window = window_story(new_story)
    key = window.story.new_row_id(SAVE, actor=window.story.user)
    window.story.expect_refusal(f"person-preset remove {key}", f"preset {key} is another person's", actor=window.new_person("Bob"))


def test_another_person_cannot_rename_your_preset(new_story):
    window = window_story(new_story)
    key = window.story.new_row_id(SAVE, actor=window.story.user)
    window.story.expect_refusal(f"person-preset rename {key} --name Theirs", "only a person keeps a layout", actor=window.new_person("Bob"))


def test_a_second_preset_with_the_same_name_for_the_page_is_refused(new_story):
    window = window_story(new_story)
    window.story.new_row_id(SAVE, actor=window.story.user)
    window.story.expect_refusal(SAVE, "you have a preset named Mine for home already", actor=window.story.user)


def test_a_shape_that_is_no_layout_is_refused(new_story):
    window = window_story(new_story)
    window.story.expect_refusal("person-preset save --page home --name Mine --shape '{\"rows\": 2}' --environment main", "is no layout", actor=window.story.user)


def test_renaming_a_preset_that_does_not_exist_is_refused(new_story):
    window = window_story(new_story)
    window.story.expect_refusal("person-preset rename 99 --name Review", "99", actor=window.story.user)
