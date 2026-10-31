from core.base.registry.button_line import ButtonLine

LINE = ButtonLine("memories", "memory open {row_id}")


def test_a_button_line_allows_its_own_line_with_a_row_number():
    assert LINE.allows(["memory", "open", "12"])


def test_a_button_line_refuses_another_command_or_a_filled_word_that_is_no_number():
    assert not LINE.allows(["memory", "delete", "12"]) and not LINE.allows(["memory", "open", "all"])


def test_a_button_line_refuses_a_line_with_words_added_or_left_out():
    assert not LINE.allows(["memory", "open"]) and not LINE.allows(["memory", "open", "12", "--force"])
