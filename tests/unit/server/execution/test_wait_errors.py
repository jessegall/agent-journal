from server.errors.execution_wait_error import ExecutionWaitError
from server.errors.lane_busy_error import LaneBusyError
from server.errors.write_turn_busy_error import WriteTurnBusyError


def test_text_names_class_and_line_of_the_holder():
    error = LaneBusyError.waited(3.5, ["agent hook at reserved: PreToolUse"])
    assert str(error) == "the journal was busy for 3.5 seconds: waiting for agent hook at reserved: PreToolUse"


def test_two_holders_are_both_named():
    error = ExecutionWaitError.waited(45, ["agent hook at reserved: Stop", "journal command at normal: task list"])
    assert "agent hook at reserved: Stop; journal command at normal: task list" in str(error)


def test_a_write_turn_wait_is_a_timeout_with_the_same_text():
    error = WriteTurnBusyError.waited(20, ["a hook of session s-1"])
    assert isinstance(error, TimeoutError) and str(error).startswith("the journal was busy for 20.0 seconds")
