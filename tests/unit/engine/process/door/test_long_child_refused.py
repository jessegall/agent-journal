from pathlib import Path

import pytest

from engine.enums.execution_priority import ExecutionPriority
from engine.enums.process_type import ProcessType
from engine.errors.long_child_error import LongChildError
from engine.execution.current_execution import HOOK_CLASS, CurrentExecution
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.process.door.runner_program import RunnerProgram
from tests.unit.support.plain_executor import OpenAdmission, OpenGate, SilentErrors, WaitingPlacement


def merge(tmp_path: Path) -> ExecutionRequest:
    return ExecutionRequest(["echo", "merged"], tmp_path, ProcessType.MERGE, 5)


def test_never_waiting_admission_also_refuses(tmp_path: Path):
    placement = WaitingPlacement(True)
    with CurrentExecution(ExecutionPriority.AGENT, HOOK_CLASS, "PostToolUse").applied():
        with pytest.raises(LongChildError) as refused:
            ProcessExecutor(placement, RunnerProgram(), OpenGate(), SilentErrors(), OpenAdmission()).execute(merge(tmp_path))
    assert refused.value.text == "a hook cannot wait on long work: queue it as a follow-up (merge: echo merged)"
    assert [execution.exit_code for execution in placement.ended_runs] == [1]


def test_a_run_that_does_not_wait_is_allowed_in_a_hook(tmp_path: Path):
    with CurrentExecution(ExecutionPriority.AGENT, HOOK_CLASS, "PostToolUse").applied():
        execution = ProcessExecutor(WaitingPlacement(False), RunnerProgram(), OpenGate(), SilentErrors(), OpenAdmission()).execute(merge(tmp_path))
    assert execution.exit_code == 0


def test_a_command_may_wait_on_a_merge(tmp_path: Path):
    with CurrentExecution(ExecutionPriority.AGENT, "command", "worker merge 3 --wait").applied():
        execution = ProcessExecutor(WaitingPlacement(True), RunnerProgram(), OpenGate(), SilentErrors(), OpenAdmission()).execute(merge(tmp_path))
    assert execution.exit_code == 0
