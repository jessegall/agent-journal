from tests.stories.core.base.setting.support.setting_samples import PATH
from tests.stories.core.support.fixtures import UserJoined


def open_story(new_story):
    story = new_story(f"{PATH}:OpenModule", fixture=UserJoined)
    story.expect_success("setting set open.color.builder blue --project", actor=story.user)
    story.expect_success("setting set open.color.worker green --project", actor=story.user)
    return story


def test_an_open_group_lists_every_key_stored_under_it_and_not_its_template(new_story):
    story = open_story(new_story)
    story.expect_ordered_lines("setting tree", "open.color: on", "  open.color.builder: blue", "  open.color.worker: green", actor=story.user)
    story.expect_rows("open.color.*" not in story.run("setting tree", actor=story.user).output_text)


def test_a_key_under_an_open_group_is_titled_by_its_own_name_and_names_its_module(new_story):
    story = open_story(new_story)
    story.expect_text("setting tree --json", '"key": "open.color.builder"', '"title": "builder"', '"module": "open"', actor=story.user)
