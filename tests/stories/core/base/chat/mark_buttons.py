from core.base.database.database import Database
from core.base.registry.button_line import ButtonLine
from core.base.registry.button_window import ButtonWindow
from core.base.registry.registry import Registry
from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_mark_button_is_an_allowed_line_of_the_chat_window_kept_with_its_module(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    registry = Registry.read(story.container.get(Database))
    assert tuple(line for line in registry.button_lines(ButtonWindow.MARKS) if line.module == "good") == (ButtonLine("good", "task edit {row_id}"),)
    assert tuple(line for line in registry.button_lines(ButtonWindow.DOCK) if line.module == "good") == ()


def test_a_button_line_is_allowed_for_no_other_window(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    assert Registry.read(story.container.get(Database)).button_lines("messages.board") == ()
