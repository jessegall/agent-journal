from engine.database.database import Database
from engine.enums.button_window import ButtonWindow
from engine.registry.button_line import ButtonLine
from engine.registry.registry import Registry
from tests.stories.engine.chat.support.mark_faults import PATH


def expect_button_lines_registry(story, text, expected) -> None:
    actual = Registry.read(story.container.get(Database)).button_lines(text)
    assert actual == expected, actual


def expect_button_lines_registry_2(registry, text, expected) -> None:
    actual = [line for line in registry.button_lines(ButtonWindow.DOCK) if line.module == text]
    assert actual == expected, actual


def expect_button_lines_registry_3(registry, text, expected) -> None:
    actual = [line for line in registry.button_lines(ButtonWindow.MARKS) if line.module == text]
    assert actual == expected, actual


def test_a_mark_button_is_an_allowed_line_of_the_chat_window_kept_with_its_module(journal):
    journal.expect_sync_success(f"{PATH}:GoodModule")
    registry = Registry.read(journal.database)
    expect_button_lines_registry_3(registry, "good", [ButtonLine("good", "task edit {row_id}", False, label="Edit the task")])
    expect_button_lines_registry_2(registry, "good", [])
