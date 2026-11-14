from dataclasses import replace

from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.module.helper_type_check import HelperTypeCheck
from suites.coding.modules.workers.support.worker_operation_line import WORKER_OPERATION_RUN
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.modules.workers.types.worker_commands import WorkerCommands

LINES = {WORKER_OPERATION_RUN: frozenset([JournalLineClass.BACKGROUND])}


def problems(commands: WorkerCommands) -> list[str]:
    return list(HelperTypeCheck.run_problems("the worker", commands, Worker.journal_runs, LINES))


def test_the_worker_declares_the_operation_line_the_journal_runs_under_it():
    assert Worker.journal_runs == tuple([WORKER_OPERATION_RUN])


def test_the_workers_list_passes_the_check_of_the_lines_the_journal_runs_under_it():
    assert problems(WorkerCommands()) == []


def test_removing_the_operation_line_from_the_workers_list_fails_the_check():
    without = replace(WorkerCommands(), lines=tuple(line for line in WorkerCommands().lines if line != WORKER_OPERATION_RUN))
    assert problems(without) == [f"the worker does not list the line {WORKER_OPERATION_RUN}, which the journal runs under it"]
