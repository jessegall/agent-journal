from dataclasses import replace

import pytest

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.reason_code import ReasonCode
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.decisions.output_facts import OutputFacts
from core.modules.processes.models.enums.reader_layer import ReaderLayer
from core.modules.processes.support.decisions.reading_case import ReadingCase
from core.modules.processes.support.decisions.reading_decider import ReadingDecider

SUGGEST = PressureLevel.SUGGEST.exits
PREVENT = PressureLevel.PREVENT.exits
BLOCK = PressureLevel.BLOCK.exits
TEST_OUTPUT = b"collected 3 items\n\n===== 3 passed in 0.10s =====\n"

MAIN_BUILD = ReadingCase(command_key="custom-build run", category=CommandCategory.BUILD, classification_known=True, has_asking_flag=False,
                         output_hidden=False, is_saved_command=False, is_plugin_run=False, moment=ReadingMoment.START, age_seconds=0,
                         run_state=ProcessState.RUNNING, cadence_state=CadenceState.STREAMING, exit_code=None, reader_layer=None, reader_judgement=None, reader_is_default=False, reader_failed=False, count_missing=False,
                         draft_fits=False, output=None, runs_without_change=0, request_is_waiting=False, was_skipped=False, has_unreadable_mark=False,
                         role_must_have_reader=False, role_may_write_readers=True, role_uses_saved_commands=True, readers_forced=True)
WORKER_BUILD = replace(MAIN_BUILD, role_must_have_reader=True, role_uses_saved_commands=False)
HELPER_SEARCH = replace(MAIN_BUILD, category=CommandCategory.SEARCH, role_may_write_readers=False)


def ended(case: ReadingCase, sample: bytes = TEST_OUTPUT, exit_code: int = 0, age_seconds: int = 120) -> ReadingCase:
    return replace(case, moment=ReadingMoment.END, run_state=ProcessState.FINISHED, exit_code=exit_code, age_seconds=age_seconds,
                   output=OutputFacts.measured(sample, len(sample), exit_code, case.category))


def with_reader(case: ReadingCase, judgement: ReaderJudgement) -> ReadingCase:
    return replace(case, reader_layer=ReaderLayer.PROJECT, reader_judgement=judgement)


NOTHING_NEEDED = (ReaderState.NOT_NEEDED, ReaderAction.NOTHING, PressureLevel.SUGGEST, ())

TABLE = {
    "read-only helper search": (HELPER_SEARCH, NOTHING_NEEDED),
    "journal command": (replace(MAIN_BUILD, category=CommandCategory.JOURNAL), NOTHING_NEEDED),
    "asking flag": (replace(MAIN_BUILD, has_asking_flag=True), NOTHING_NEEDED),
    "rejected command": (ended(MAIN_BUILD, b"usage: build [options]\nunknown option --fast\n", exit_code=2), NOTHING_NEEDED),
    "plugin run": (replace(MAIN_BUILD, is_plugin_run=True), NOTHING_NEEDED),
    "short successful run": (ended(MAIN_BUILD, age_seconds=3), NOTHING_NEEDED),
    "suitable reader": (with_reader(ended(MAIN_BUILD), ReaderJudgement()), (ReaderState.SUITABLE, ReaderAction.NOTHING, PressureLevel.SUGGEST, ())),
    "marked unreadable": (replace(MAIN_BUILD, has_unreadable_mark=True), (ReaderState.UNREADABLE, ReaderAction.NOTHING, PressureLevel.SUGGEST, SUGGEST)),
    "found unreadable": (ended(MAIN_BUILD, b"", exit_code=1), (ReaderState.UNREADABLE, ReaderAction.DECLARE_UNREADABLE, PressureLevel.SUGGEST, SUGGEST)),
    "missing at start": (MAIN_BUILD, (ReaderState.MISSING, ReaderAction.NOTHING, PressureLevel.SUGGEST, SUGGEST)),
    "missing while running": (replace(MAIN_BUILD, moment=ReadingMoment.RUNNING), (ReaderState.MISSING, ReaderAction.NOTHING, PressureLevel.SUGGEST, SUGGEST)),
    "missing at end": (ended(MAIN_BUILD), (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.SUGGEST, SUGGEST)),
    "poor at end": (with_reader(ended(MAIN_BUILD), ReaderJudgement(missing=tuple(["--summary"]))), (ReaderState.POOR, ReaderAction.SUGGEST, PressureLevel.SUGGEST, SUGGEST)),
    "draftable at end": (replace(ended(MAIN_BUILD), draft_fits=True), (ReaderState.DRAFTABLE, ReaderAction.DRAFT_READY, PressureLevel.SUGGEST, SUGGEST)),
    "worker with a waiting request": (replace(WORKER_BUILD, request_is_waiting=True), (ReaderState.MISSING, ReaderAction.REQUIRE, PressureLevel.BLOCK, BLOCK)),
    "main after 0 runs": (ended(MAIN_BUILD), (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.SUGGEST, SUGGEST)),
    "main after 1 run": (replace(ended(MAIN_BUILD), runs_without_change=1), (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.SUGGEST, SUGGEST)),
    "main after 2 runs": (replace(ended(MAIN_BUILD), runs_without_change=2), (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.PREVENT, PREVENT)),
    "main after 3 runs": (replace(ended(MAIN_BUILD), runs_without_change=3), (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.PREVENT, PREVENT)),
    "worker after 2 runs": (replace(WORKER_BUILD, runs_without_change=2), (ReaderState.MISSING, ReaderAction.REQUIRE, PressureLevel.PREVENT, PREVENT)),
    "skipped after 3 runs": (replace(ended(MAIN_BUILD), runs_without_change=3, was_skipped=True), (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.SUGGEST, SUGGEST)),
    "redirected line": (replace(MAIN_BUILD, output_hidden=True), (ReaderState.MISSING, ReaderAction.NOTHING, PressureLevel.PREVENT, PREVENT)),
    "suitable reader without the count a worker needs": (replace(with_reader(ended(WORKER_BUILD), ReaderJudgement()), count_missing=True),
                                                         (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.SUGGEST, SUGGEST)),
    "unknown command": (replace(ended(MAIN_BUILD), category=CommandCategory.UNKNOWN, classification_known=False),
                        (ReaderState.MISSING, ReaderAction.SUGGEST, PressureLevel.SUGGEST, (*SUGGEST, ReadingExit.CLASSIFY))),
}


@pytest.mark.parametrize("case, expected", TABLE.values(), ids=TABLE.keys())
def test_the_decision_of_each_case(case, expected):
    decision = ReadingDecider().decide(case)
    assert (decision.state, decision.action, decision.level, decision.exits) == expected


@pytest.mark.parametrize("case, reason", [
    (replace(MAIN_BUILD, output_hidden=True), ReasonCode.REDIRECTED),
    (replace(WORKER_BUILD, request_is_waiting=True), ReasonCode.REQUEST_WAITING),
    (ended(MAIN_BUILD), ReasonCode.READER_MISSING),
    (replace(ended(MAIN_BUILD), draft_fits=True), ReasonCode.DRAFT_FITS),
    (replace(with_reader(ended(WORKER_BUILD), ReaderJudgement()), count_missing=True), ReasonCode.COUNT_MISSING),
], ids=["redirected", "request waiting", "reader missing", "draft fits", "count missing"])
def test_the_reason_of_a_pressing_decision(case, reason):
    assert ReadingDecider().decide(case).reason is reason
