
from core.modules.messages.messages_module import MessagesModule
from tests.stories.core.modules.docking.support.dock_samples import docked, docked_state


def expect_value_limit(text, text_2, text_3, expected) -> None:
    actual = {text, text_2, text_3}
    assert actual <= expected, actual


def expect_title(story, item, expected) -> None:
    actual = story.row(type(item), item.id).title
    assert actual == expected, actual


def expect_output_with_2(story, text, expected) -> None:
    actual = story.run(text).output_text
    assert expected in actual, actual


def expect_reads_window_with(window, expected) -> None:
    actual = window.reads
    assert expected in actual, actual


def expect_docked_state_2(story, leaves, stays, expected) -> None:
    actual = (docked_state(story, leaves), docked_state(story, stays))
    assert actual == expected, actual


def expect_docked_state_3(story, oldest, newer, added, expected) -> None:
    actual = (docked_state(story, oldest), docked_state(story, newer), docked_state(story, added))
    assert actual == expected, actual


def expect_docked_state_4(story, first, second, expected) -> None:
    actual = (docked_state(story, docked(story, first)), docked_state(story, docked(story, second)))
    assert actual == expected, actual


def test_the_chat_window_may_run_the_buttons_of_its_docked_cards():
    chat = next(window for window in MessagesModule.window_declarations() if window.name == "messages.chat")
    expect_value_limit("dock remove", "dock keep", "dock unkeep", set(chat.runs))
