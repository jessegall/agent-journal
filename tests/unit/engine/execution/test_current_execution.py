import threading

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.current_execution import BACKGROUND_EXECUTION, CurrentExecution

HOOK = CurrentExecution(ExecutionPriority.IMMEDIATE, "hook", "PreToolUse")


def test_default_is_background():
    assert CurrentExecution.read() == CurrentExecution(ExecutionPriority.BACKGROUND)


def test_set_for_a_block_and_restored():
    with HOOK.applied():
        assert CurrentExecution.read() == HOOK
    assert CurrentExecution.read() == BACKGROUND_EXECUTION


def test_other_thread_keeps_its_own():
    seen = []
    with HOOK.applied():
        thread = threading.Thread(target=lambda: seen.append(CurrentExecution.read()))
        thread.start()
        thread.join()
    assert seen == [BACKGROUND_EXECUTION]
