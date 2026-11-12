from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.support.decisions.output_facts import OutputFacts

TEST_OUTPUT = b"collected 3 items\n\ntests/cart.py ... [100%]\n\n===== 3 passed in 0.10s =====\n"


def facts(sample: bytes, exit_code: int | None = 0, category: CommandCategory = CommandCategory.TEST_RUN) -> OutputFacts:
    return OutputFacts.measured(sample, len(sample), exit_code, category)


def text_with_invalid_share(share_percent: int) -> bytes:
    return b"\xff" * share_percent + b"a" * (99 - share_percent) + b"\n"


def test_a_normal_test_output_gives_no_reason():
    assert facts(TEST_OUTPUT).unreadable_reason is None


def test_an_ended_watched_run_with_no_byte_is_empty_and_a_running_one_is_not():
    assert facts(b"").unreadable_reason is UnreadableReason.EMPTY
    assert facts(b"", exit_code=None).unreadable_reason is None
    assert facts(b"", category=CommandCategory.READ).unreadable_reason is None


def test_a_null_byte_makes_an_output_binary():
    assert facts(b"ok\n\0\n").unreadable_reason is UnreadableReason.BINARY


def test_bytes_that_are_not_text_make_an_output_binary_above_a_tenth():
    assert facts(text_with_invalid_share(10)).unreadable_reason is None
    assert facts(text_with_invalid_share(11)).unreadable_reason is UnreadableReason.BINARY


def test_a_long_line_with_no_newline_after_it_is_one_line_and_a_long_line_among_others_is_not():
    assert facts(b"start\n" + b"x" * (8 * 1024 + 1)).unreadable_reason is UnreadableReason.SINGLE_LINE
    assert facts(b"x" * (13 * 1024) + b"\nok\n").unreadable_reason is None


def test_carriage_returns_in_more_than_half_the_bytes_make_one_line():
    assert facts(b"a\r" * 50 + b"\n").unreadable_reason is None
    assert facts(b"\r\r\ra\n").unreadable_reason is UnreadableReason.SINGLE_LINE


def test_an_output_that_ends_on_a_prompt_is_noted_and_is_no_reason_alone():
    waiting = facts(b"Installing\nProceed (y/n)?", exit_code=None)
    assert (waiting.ends_on_prompt, waiting.unreadable_reason) == (True, None)
    assert not facts(b"Installing\nProceed (y/n)?\n", exit_code=None).ends_on_prompt


def test_a_rejected_command_is_noted():
    assert facts(b"usage: tool [OPTIONS]\nunknown option --tail\n", exit_code=2).was_rejected


def test_a_start_that_crashed_is_noted():
    assert facts(b"Traceback (most recent call last)\n  boom\n", exit_code=1).start_crashed


def test_a_run_killed_before_its_end_is_cut_short():
    assert facts(b"collected 3 items\n", exit_code=137).was_cut_short
    assert not facts(TEST_OUTPUT).was_cut_short


def test_bytes_that_are_not_valid_utf8_do_not_raise():
    measured = facts(b"\xc3\x28 broken \xa0\xa1\n")
    assert measured.binary_share > 0
