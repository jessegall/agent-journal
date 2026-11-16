from tests.stories.support.story_checks import expect_value
from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.engine.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_button_line_is_allowed_for_no_other_window(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    expect_value(Registry.read(story.container.get(Database)).button_lines('messages.board'), ())

