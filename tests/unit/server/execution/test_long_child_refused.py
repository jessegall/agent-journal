from pathlib import Path

import pytest

from engine.enums.execution_priority import ExecutionPriority
from engine.enums.process_type import ProcessType
from engine.errors.long_child_error import LongChildError
from engine.journal.journal_home import JournalHome
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.process.door.runner_program import RunnerProgram
from server.hook.hook_database import HookDatabase
from tests.unit.support.plain_executor import OpenAdmission, OpenGate, SilentErrors, WaitingPlacement


def door(is_waiting: bool) -> ProcessExecutor:
    return ProcessExecutor(WaitingPlacement(is_waiting), RunnerProgram(), OpenGate(), SilentErrors(), OpenAdmission())


@pytest.fixture
def hooks(tmp_path: Path):
    hook_database = HookDatabase(JournalHome(tmp_path), instant_capacity=2)
    yield hook_database
    hook_database.close()


def test_hook_waiting_on_a_long_run_is_refused_with_the_text(hooks, tmp_path: Path):
    with hooks.used(ExecutionPriority.AGENT, 1, "s-1", "PostToolUse"):
        with pytest.raises(LongChildError) as refused:
            door(True).execute(ExecutionRequest(["echo", "merged"], tmp_path, ProcessType.MERGE, 5))
    assert refused.value.text.startswith("a hook cannot wait on long work: queue it as a follow-up")


def test_short_child_is_allowed(hooks, tmp_path: Path):
    with hooks.used(ExecutionPriority.AGENT, 1, "s-1", "PostToolUse"):
        assert door(False).execute(ExecutionRequest(["echo", "read"], tmp_path, ProcessType.QUICK, 5)).exit_code == 0


def test_a_run_outside_any_hook_may_wait(tmp_path: Path):
    assert door(True).execute(ExecutionRequest(["echo", "merged"], tmp_path, ProcessType.MERGE, 5)).exit_code == 0
