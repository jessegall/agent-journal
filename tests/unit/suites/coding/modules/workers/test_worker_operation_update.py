from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.errors.refusal import Refusal
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.run_worker_operation import run_worker_operation_subcommand
from suites.coding.modules.workers.commands.run_worker_operation.run_worker_operation_subcommand import RunWorkerOperationSubcommand
from suites.coding.modules.workers.commands.update_worker.update_worker_handler import UpdateWorkerHandler
from suites.coding.modules.workers.listeners.worker_run_ended_listener import WorkerRunEndedListener
from suites.coding.modules.workers.models.enums.update_result import UpdateResult
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worktree_update import WorktreeUpdate
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer
from engine.time.polled_wait import PolledWait

import pytest
from suites.coding.modules.workers.models.enums.worker_operation_name import WORKER_OPERATION_UPDATED
from suites.coding.modules.workers.models.enums.worker_operation_name import WORKER_OPERATION_UPDATE_CONFLICT
from suites.coding.modules.workers.models.enums.worker_operation_name import WORKER_OPERATION_UPDATE_FAILED

WORKER = 7
OUTPUT = 40


def operation(name: WorkerOperationName = WorkerOperationName.UPDATE, outcome: UpdateResult | None = None, process_id: int = OUTPUT) -> WorkerOperation:
    return WorkerOperation(worker_id=WORKER, creator_id=WORKER, actor_type=ActorType.AGENT, process_id=process_id, line="worker update --wait", name=name,
                           source_message_id=None, source_version=0, source_unavailable=False, selecting_actor_id=None, source_origin="", update_outcome=outcome)


def ended(exit_code: int) -> Process:
    return Process(id=OUTPUT, session_agent_id=WORKER, creator_id=WORKER, line="journal worker-operation run 7", folder="/work",
                   category=CommandCategory.BACKGROUND_JOB, limit_seconds=3600, state=ProcessState.FINISHED, exit_code=exit_code)


class Numbers:
    def number(self, model: str, row_id: int) -> int:
        return 3


def listener() -> WorkerRunEndedListener:
    return WorkerRunEndedListener(None, None, None, None, None, None, None, Numbers())


def test_the_finished_line_of_an_update_follows_its_result_and_a_clash_ending_with_exit_code_0_is_a_clash():
    assert listener().update_nudge(operation(outcome=UpdateResult.UPDATED), ended(0)).text == WORKER_OPERATION_UPDATED.nudge(worker=3, output=40).text
    assert listener().update_nudge(operation(outcome=UpdateResult.CURRENT), ended(0)).text == WORKER_OPERATION_UPDATED.nudge(worker=3, output=40).text
    assert listener().update_nudge(operation(outcome=UpdateResult.CONFLICTS), ended(0)).text == WORKER_OPERATION_UPDATE_CONFLICT.nudge(worker=3, output=40).text
    assert listener().update_nudge(operation(outcome=None), ended(1)).text == WORKER_OPERATION_UPDATE_FAILED.nudge(worker=3, output=40).text


def test_an_update_already_on_its_base_is_current_a_moved_one_updated_and_markers_a_clash():
    assert UpdateWorkerHandler.classified(WorktreeUpdate.current("abc")) is UpdateResult.CURRENT
    assert UpdateWorkerHandler.classified(WorktreeUpdate("abc")) is UpdateResult.UPDATED
    assert UpdateWorkerHandler.classified(WorktreeUpdate("abc", tuple(["cart.py"]), "s1")) is UpdateResult.CONFLICTS


def test_the_accepted_line_of_an_update_tells_the_worker_not_to_edit_files_meanwhile():
    assert WorkerRunAnswer(None, None, Numbers()).operation_instruction(operation()) == "do not edit files until it ends, you hear when it ends"


class Operations:
    """An earlier command of the worker that ends after a few looks."""

    def __init__(self, end_check_count: int) -> None:
        self.looks = end_check_count

    def runs_prior(self, worker_id: int, process_id: int) -> bool:
        self.looks -= 1
        return self.looks > 0


def test_an_update_queued_behind_a_running_commit_waits_for_it_and_then_runs(monkeypatch):
    monkeypatch.setattr(run_worker_operation_subcommand, "TURN_WAIT", PolledWait(limit_seconds=5, pause_seconds=0.01))
    operations = Operations(3)
    RunWorkerOperationSubcommand(None, operations).waited_turn(operation())
    assert operations.looks == 0


def test_an_update_whose_earlier_command_never_ends_is_refused(monkeypatch):
    monkeypatch.setattr(run_worker_operation_subcommand, "TURN_WAIT", PolledWait(limit_seconds=0.05, pause_seconds=0.01))
    with pytest.raises(Refusal, match="the update waited"):
        RunWorkerOperationSubcommand(None, Operations(10_000)).waited_turn(operation())
